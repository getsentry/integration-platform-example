import os
import responses

from dotenv import load_dotenv
from tests.api import APITestCase
from tests.mocks import MOCK_SETUP

load_dotenv()
SENTRY_URL = os.getenv("SENTRY_URL")


class SetupTest(APITestCase):
    @responses.activate
    def test_post(self):
        uuid = MOCK_SETUP["queryInstall"]["installationId"]

        # Simulate getting a token.
        responses.add(
            responses.POST,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/",
            content_type="json",
            match_querystring=False,
            json=MOCK_SETUP["newToken"]
        )

        # Simulate updating an installation.
        responses.add(
            responses.PUT,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/",
            content_type="json",
            match_querystring=False,
            json=MOCK_SETUP["installation"],
        )

        response = self.client.get(
            "/api/sentry/setup/",
            query_string=MOCK_SETUP["queryInstall"],
        )
        assert response.status_code == 302
