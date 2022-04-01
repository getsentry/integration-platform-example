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
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()

    @responses.activate
    def test_post(self):
        uuid = MOCK_SETUP["postInstall"]["installationId"]

        # Simulate getting a token.
        responses.add(
            responses.POST,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/",
            body=json.dumps(MOCK_SETUP["newToken"]),
        )
        print("TESTSETSETS", f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/")

        # Simulate updating an installation.
        responses.add(
            responses.PUT,
            f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/",
            body=json.dumps(MOCK_SETUP["installation"]),
        )

        response = self.get_success_response(
            data={
                **MOCK_SETUP["postInstall"],
                "organizationId": self.organization.id
            },
            status_code=201
        )
        redirect_url = response.json.get('redirectUrl')

        sentry_org_slug = MOCK_SETUP["postInstall"]["sentryOrgSlug"]
        app_slug = MOCK_SETUP["installation"]["app"]["slug"]
        assert redirect_url == f"{SENTRY_URL}/settings/{sentry_org_slug}/sentry-apps/{app_slug}/"
