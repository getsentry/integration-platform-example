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

MOCK_WEBHOOK = {
    "installation.deleted": MOCK_INSTALLATION_DELETED_WEBHOOK,
    "installation.created": MOCK_INSTALLATION_CREATED_WEBHOOK,
    "issue.assigned": MOCK_ISSUE_ASSIGNED_WEBHOOK,
    "issue.created": MOCK_ISSUE_CREATED_WEBHOOK,
    "issue.ignored": MOCK_ISSUE_IGNORED_WEBHOOK,
    "issue.resolved": MOCK_ISSUE_RESOLVED_WEBHOOK,
}

MOCK_ISSUE_LINK = {
    "installationId": UUID,
    "fields": {
        "title": ISSUE["title"],
        "description": "This is an item description!",
        "column": "DOING",
        "complexity": 2,
    },
    "issueId": ISSUE["id"],
}
