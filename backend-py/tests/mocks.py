UUID = "7a485448-a9e2-4c85-8a3c-4f44175783c9"

INSTALLATION = {
    "app": {
        "uuid": "64bf2cf4-37ca-4365-8dd3-6b6e56d741b8",
        "slug": "app",
    },
    "organization": {
        "slug": "example",
    },
    "uuid": UUID,
}

ISSUE = {
    "id": "123",
    "shortId": "IPE-1",
    "title": "Error #1: This is a test error!",
    "culprit": "SentryCustomError(frontend-ts/src/util)",
    "level": "error",
    "status": "unresolved",
    "statusDetails": {},
    "isPublic": False,
    "platform": "javascript",
    "project": {
        "id": "456",
        "name": "ipe",
        "slug": "ipe",
        "platform": "javascript-react",
    },
    "type": "error",
    "metadata": {
        "value": "This is a test error!",
        "type": "Another Error #1",
        "filename": "/frontend-ts/src/util.ts",
        "function": "SentryCustomError",
        "display_title_with_tree_label": False,
    },
    "numComments": 0,
    "assignedTo": {
        "email": "person@example.com",
        "type": "user",
        "id": "789",
        "name": "Person",
    },
    "isBookmarked": False,
    "isSubscribed": False,
    "hasSeen": False,
    "isUnhandled": False,
    "count": "1",
    "userCount": 1,
    "firstSeen": "2022-04-04T18:17:18.320000Z",
    "lastSeen": "2022-04-04T18:17:18.320000Z",
}

EVENT = {
    "event_id": 'def456',
    "platform": ISSUE['platform'],
    "datetime": ISSUE['firstSeen'],
    "culprit": ISSUE['culprit'],
    "metadata": ISSUE['metadata'],
    "title": ISSUE['title'],
    "issue_id": ISSUE['id'],
    "environment": 'production',
    "web_url": f"https://sentry.io/organizations/lxyz/issues/{ISSUE['id']}/events/def456/",
    "breadcrumbs": {},
    "contexts": {},
    "sdk": {},
}

ALERT_RULE_ACTION_VALUES = {
    'title': 'Alert Rule Action Item Title',
    'description': 'Alert Rule Action Item Description',
    'userId': 1,
}

ALERT_RULE_ACTION_SETTINGS = list(map(
    lambda item: {'name': item[0], 'value': item[1]},
    ALERT_RULE_ACTION_VALUES.items()
))

ISSUE_ALERT_WITH_ALERT_RULE_ACTION = {
    'id': '456',
    'title': 'issue alert',
    'settings': ALERT_RULE_ACTION_SETTINGS,
}

METRIC_ALERT = {
    'id': '789',
    'alert_rule': {
        id: '456',
        'name': 'metric alert',
        'status': 0,
        'triggers': [],
    },
    'status': 2,
    'status_method': 3,
    'type': 2,
    'title': 'metric alert',
}

METRIC_ALERT_WITH_ALERT_RULE_ACTION = {
    **METRIC_ALERT,
    'alert_rule': {
        **METRIC_ALERT['alert_rule'],
        'triggers': [
            {
                'label': 'critical',
                'actions': [
                  {
                      'type': 'sentry_app',
                      'settings': ALERT_RULE_ACTION_SETTINGS,
                      'sentry_app_installation_uuid': UUID,
                  },
                ],
            },
            {
                'label': 'warning',
                'actions': [
                    {
                        'type': 'sentry_app',
                        'settings': ALERT_RULE_ACTION_SETTINGS,
                        'sentry_app_installation_uuid': UUID,
                    },
                ],
            },
        ],
    },
}

METRIC_ALERT_DESCRIPTION = '5 events in the last 10 minutes'

MOCK_SETUP = {
    "postInstall": {
        "code": "installCode",
        "installationId": UUID,
        "sentryOrgSlug": "example",
    },
    "newToken": {
        "token": "abc123",
        "refreshToken": "def456",
        "expiresAt": "2022-01-01T08:00:00.000Z",
    },
    "installation": INSTALLATION,
}

MOCK_INSTALLATION_CREATED_WEBHOOK = {
    "action": "created",
    "data": {"installation": INSTALLATION},
    "installation": INSTALLATION,
}

MOCK_INSTALLATION_DELETED_WEBHOOK = {
    "action": "deleted",
    "data": {"installation": INSTALLATION},
    "installation": INSTALLATION,
}

MOCK_ISSUE_ASSIGNED_WEBHOOK = {
    "action": "assigned",
    "data": {"issue": ISSUE},
    "installation": INSTALLATION,
}

MOCK_ISSUE_CREATED_WEBHOOK = {
    "action": "created",
    "data": {"issue": ISSUE},
    "installation": INSTALLATION,
}

MOCK_ISSUE_IGNORED_WEBHOOK = {
    "action": "ignored",
    "data": {"issue": {**ISSUE, "status": "ignored"}},
    "installation": INSTALLATION,
}

MOCK_ISSUE_RESOLVED_WEBHOOK = {
    "action": "resolved",
    "data": {"issue": {**ISSUE, "status": "resolved"}},
    "installation": INSTALLATION,
}

MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK = {
    'action': 'triggered',
    'data': {'event': EVENT},
    'installation': INSTALLATION,
}

MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK_WITH_ALERT_RULE_ACTION = {
    'action': 'triggered',
    'data': {'event': EVENT, 'issue_alert': ISSUE_ALERT_WITH_ALERT_RULE_ACTION},
    'installation': INSTALLATION,
}

MOCK_BASE_METRIC_ALERT_WEBHOOK = {
    'data': {
        'metric_alert': METRIC_ALERT,
        'description_text': METRIC_ALERT_DESCRIPTION,
    },
    'installation': INSTALLATION,
}

MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION = {
    'data': {
        'metric_alert': METRIC_ALERT_WITH_ALERT_RULE_ACTION,
        'description_text': METRIC_ALERT_DESCRIPTION,
    },
    'installation': INSTALLATION,
}

MOCK_METRIC_ALERT_RESOLVED_WEBHOOK = {
    'action': 'resolved',
    **MOCK_BASE_METRIC_ALERT_WEBHOOK,
}

MOCK_METRIC_ALERT_WARNING_WEBHOOK = {
    'action': 'warning',
    **MOCK_BASE_METRIC_ALERT_WEBHOOK,
}

MOCK_METRIC_ALERT_CRITICAL_WEBHOOK = {
    'action': 'critical',
    **MOCK_BASE_METRIC_ALERT_WEBHOOK,
}

MOCK_METRIC_ALERT_WARNING_WEBHOOK_WITH_ALERT_RULE_ACTION = {
    'action': 'warning',
    **MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION,
}

MOCK_METRIC_ALERT_CRITICAL_WEBHOOK_WITH_ALERT_RULE_ACTION = {
    'action': 'critical',
    **MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION,
}

MOCK_WEBHOOK = {
    "installation.deleted": MOCK_INSTALLATION_DELETED_WEBHOOK,
    "installation.created": MOCK_INSTALLATION_CREATED_WEBHOOK,
    "issue.assigned": MOCK_ISSUE_ASSIGNED_WEBHOOK,
    "issue.created": MOCK_ISSUE_CREATED_WEBHOOK,
    "issue.ignored": MOCK_ISSUE_IGNORED_WEBHOOK,
    "issue.resolved": MOCK_ISSUE_RESOLVED_WEBHOOK,
    'event_alert.triggered': MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK,
    'event_alert.triggered:with_alert_rule_action':
    MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK_WITH_ALERT_RULE_ACTION,
    'metric_alert.resolved': MOCK_METRIC_ALERT_RESOLVED_WEBHOOK,
    'metric_alert.warning': MOCK_METRIC_ALERT_WARNING_WEBHOOK,
    'metric_alert.warning:with_alert_rule_action':
    MOCK_METRIC_ALERT_WARNING_WEBHOOK_WITH_ALERT_RULE_ACTION,
    'metric_alert.critical': MOCK_METRIC_ALERT_CRITICAL_WEBHOOK,
    'metric_alert.critical:with_alert_rule_action':
    MOCK_METRIC_ALERT_CRITICAL_WEBHOOK_WITH_ALERT_RULE_ACTION,
}

MOCK_ISSUE_LINK = {
    "installationId": UUID,
    "fields": {
        "title": ISSUE["title"],
        "description": "This is an item description!",
        "column": "DOING",
        "complexity": 2,
        "itemId": None
    },
    "issueId": ISSUE["id"],
}

MOCK_ALERT_RULE_ACTION = {
    'installationId': UUID,
    'fields': ALERT_RULE_ACTION_SETTINGS,
}
