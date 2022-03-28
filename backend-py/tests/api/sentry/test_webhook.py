from src.database import db_session
from src.models import SentryInstallation

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK


class WebhookTest(APITestCase):
    endpoint = "webhook_index"
    method = "post"

    def test_empty(self):
        self.get_success_response()

    def test_post(self):
        uuid = MOCK_WEBHOOK["data"]["installation"]["uuid"]
        installation = SentryInstallation(
            uuid=uuid,
            org_slug="marcos",
            token="1",
            refresh_token="2",
        )
        db_session.add(installation)
        db_session.commit()

        self.get_success_response(
            data=MOCK_WEBHOOK,
            headers={"sentry-hook-resource": "installation"}
        )
        assert SentryInstallation.query.count() == 0

