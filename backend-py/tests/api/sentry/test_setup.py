import json
import os
import responses

from dotenv import load_dotenv
from tests.api import APITestCase
from tests.mocks import MOCK_SETUP

load_dotenv()
SENTRY_URL = os.getenv("SENTRY_URL")


class SetupTest(APITestCase):
    endpoint = "setup_index"

    @responses.activate
    def test_post(self):
        uuid = MOCK_SETUP["queryInstall"]["installationId"]

        # Simulate getting a token.
        responses.add(
            responses.POST,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/",
            body=json.dumps(MOCK_SETUP["newToken"]),
        )

        # Simulate updating an installation.
        responses.add(
            responses.PUT,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/",
            body=json.dumps(MOCK_SETUP["installation"]),
        )

        self.get_success_response(
            **MOCK_SETUP["queryInstall"],
            status_code=302
        )
