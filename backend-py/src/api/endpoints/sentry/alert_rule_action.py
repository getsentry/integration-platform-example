from flask import jsonify, request, Response
from functools import reduce
from typing import Sequence, TypedDict, Any

from src import app
from src.api.middleware import verify_sentry_signature
from src.models import SentryInstallation, User


class AlertRuleSettings(TypedDict):
    """
    The shape of your settings will depend on how you configure your form fields
    This example coordinates with integration-schema.json for 'alert-rule-settings'
    """

    title: str
    description: str
    userId: str


class SentryField(TypedDict):
    name: str
    value: Any


def convert_sentry_fields_to_dict(fields: Sequence[SentryField]) -> AlertRuleSettings:
    return reduce(
        lambda acc, field: {**acc, field.get("name"): field.get("value")}, fields, {}
    )


# This endpoint will only be called if the 'alert-rule-action' is present in the schema.
@app.route("/api/sentry/alert-rule-action/", methods=["POST"])
@verify_sentry_signature()
def alert_rule_action() -> Response:
    uuid = request.json.get("installationId")
    installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not installation:
        return jsonify({"message": "Invalid installation was provided"}), 400

    # Now we can validate the data the user provided to our alert rule action
    # Sending a payload with the 'message' key will be surfaced to the user in Sentry
    # This stops the user from creating the alert, so it's a good way to bubble up relevant info.
    alert_rule_action_settings = convert_sentry_fields_to_dict(
        request.json.get("fields")
    )
    if not alert_rule_action_settings.get(
        "title"
    ) or not alert_rule_action_settings.get("description"):
        return jsonify({"message": "Title and description are required"}), 400

    if alert_rule_action_settings.get("userId"):
        user = User.query.filter(
            User.id == alert_rule_action_settings.get("userId")
        ).first()
        if not user:
            return jsonify({"message": "Selected user was not found"}), 400

    app.logger.info("Successfully validated Sentry alert rule")

    # By sending a successful response code, we are approving that alert to notify our application.
    return Response("", 200)
