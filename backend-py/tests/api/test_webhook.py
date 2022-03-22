from src.database import db_session
from src.models import SentryInstallation

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK


class WebhookTest(APITestCase):
    def test_empty(self):
        response = self.client.post("/api/sentry/webhook/", json={})
        assert response.status_code == 200

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

        before = SentryInstallation.query.count()

        response = self.client.post("/api/sentry/webhook/", json=MOCK_WEBHOOK)

        assert response.status_code == 200
        assert SentryInstallation.query.count() == before - 1
