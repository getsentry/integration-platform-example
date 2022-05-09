from typing import Any, Mapping, Sequence
from flask import jsonify, request, Response

from src import app
from src.models import Item, SentryInstallation
from src.models.items import ItemColumn
from src.database import db_session

from ..alert_rule_action import AlertRuleSettings, convert_sentry_fields_to_dict, SentryField

# XXX(Leander): This assumes only one action for this integration per payload!
# Returns the alert settings as a mapping of fieldp["name"] to field["value"]


def get_alert_rule_settings(
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any],
    action: str = None,
) -> AlertRuleSettings:
    fields: Sequence[SentryField] = []
    # For issue alerts...
    if data.get("event"):
        fields = data.get("issue_alert", {}).get("settings", [])
    # For metric alerts...
    else:
        triggers = data.get("metric_alert", {}).get("alert_rule", {}).get("triggers", [])
        relevant_trigger = next(
            (trigger for trigger in triggers if trigger.get("action_type") == action), {}
        )
        trigger_actions = relevant_trigger.get("actions", [])
        integration_action = next(
            (
                t_a for t_a in trigger_actions if t_a.get("sentry_app_installation_uuid") ==
                sentry_installation.uuid
            ), {}
        )
        fields = integration_action.get("settings", [])

    return convert_sentry_fields_to_dict(fields)


def handle_issue_alert(
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any],
) -> Response:
    settings = get_alert_rule_settings(sentry_installation, data)
    item = Item(
        organization_id=sentry_installation.organization_id,
        title=f"🚨 Issue Alert: {settings.get('title') or data['event']['title']}",
        description=settings.get("description") or f"Latest Trigger: {data['event']['web_url']}",
        column=ItemColumn.Todo,
        sentry_id=data["event"]["issue_id"],
        # data["issue_alert"] is only present for Alert Rule Action webhooks
        # See https://docs.sentry.io/product/integrations/integration-platform/webhooks/#issue-alerts
        sentry_alert_id=data.get("issue_alert", {}).get("id"),
        assignee_id=settings.get("userId"),
    )
    db_session.add(item)
    db_session.commit()
    app.logger.info("Created item from Sentry issue alert trigger")


def handle_metric_alert(
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any],
    action: str,
) -> Response:
    if action == "resolved":
        item_title_prefix = '✅ Resolved Metric'
    elif action == "warning":
        item_title_prefix = '⚠️ Warning Metric'
    else:
        item_title_prefix = '🔥 Critical Metric'

    settings = get_alert_rule_settings(sentry_installation, data, action)
    item_data = {
        "title": f"{item_title_prefix}: {settings.get('title') or data['metric_alert']['title']}",
        "description": settings.get("description") or data['data.description_text'],
        "column": ItemColumn.Todo,
        "assignee_id": settings.get("userId"),
        "sentry_alert_id": data.get("metric_alert", {}).get('id'),
        "organization_id": sentry_installation.organization_id,
    }
    item = Item.query.filter(
        Item.sentry_alert_id == item_data["sentry_alert_id"],
        Item.organization_id == item_data['organization_id']
    ).first()
    item_created = item is None
    if item_created:
        item = Item(**item_data)
        db_session.add(item)
    else:
        for key, value in item_data.items():
            setattr(item, key, value)
    db_session.commit()
    app.logger.info(
        f"{'Created' if item_created else 'Modified'} item from metric alert {action} trigger"
    )


def alert_handler(
    resource: str,
    action: str,
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any]
) -> Response:
    # Issue Alerts (or Event Alerts) only have one type of action: 'triggered'
    if resource == "event_alert":
        return handle_issue_alert(sentry_installation, data)
    # Metric Alerts have three types of actions: 'resolved', 'warning', and 'critical'
    elif resource == "metric_alert":
        if action in ["resolved", "warning", "critical"]:
            return handle_metric_alert(sentry_installation, data, action)
        else:
            app.logger.info(f"Unexpected Sentry metric alert action: {action}")
            return Response('', 400)
    else:
        app.logger.info(f"Unexpected Sentry resource: {resource}")
        return Response('', 400)
