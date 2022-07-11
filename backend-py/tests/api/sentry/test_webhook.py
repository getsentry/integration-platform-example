
from src.models import SentryInstallation

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK


class WebhookTest(APITestCase):
    endpoint = 'webhook_index'
    method = 'post'

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)

    def test_bad_requests(self):
        self.get_error_response(status_code=400)
        self.get_error_response(data={'malformed': True}, status_code=400)
        self.get_error_response(
            data=MOCK_WEBHOOK['installation.deleted'],
            headers={'missing': 'header'},
            status_code=400
        )
        unknown_installation_webhook = {
            **MOCK_WEBHOOK['installation.deleted'],
            'installation': {'uuid': 'unknown'}
        }
        self.get_error_response(
            data=unknown_installation_webhook,
            headers={'sentry-hook-resource': 'installation'},
            status_code=404
        )

    def test_installation_deleted(self):
        assert SentryInstallation.query.count() == 1
        self.get_success_response(
            data=MOCK_WEBHOOK['installation.deleted'],
            headers={'sentry-hook-resource': 'installation'}
        )
        assert SentryInstallation.query.count() == 0
