from tests.api import APITestCase
from tests.mocks import MOCK_SETUP


class SetupTest(APITestCase):
    def test_post(self):
        response = self.client.get(
            "/api/sentry/setup/",
            query_string=MOCK_SETUP["queryInstall"],
        )
        assert response.status_code == 302


