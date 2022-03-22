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

MOCK_WEBHOOK = {
    "uninstallWebhook": {
        "action": "deleted",
        "data": {
            "installation": INSTALLATION,
        }
    },
}

MOCK_SETUP = {
    "queryInstall": {
        "code": "installCode",
        "installationId": UUID,
        "orgSlug": "example",
    },
    "newToken": {
        "data": {
            "token": "abc123",
            "refreshToken": "def456",
            "expiresAt": "2022-01-01T08:00:00.000Z",
        },
    },
    "installation": {
        "data": INSTALLATION
    },
}
