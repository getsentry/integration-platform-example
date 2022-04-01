from src.database import db_session
from src.models import SentryInstallation

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK


class WebhookTest(APITestCase):
    endpoint = "webhook_index"
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)

    def test_empty(self):
        self.get_error_response(status=404)

    def test_post(self):
        self.get_success_response(
            data=MOCK_WEBHOOK["installation.deleted"],
            headers={"sentry-hook-resource": "installation"}
        )
        assert SentryInstallation.query.count() == 0
