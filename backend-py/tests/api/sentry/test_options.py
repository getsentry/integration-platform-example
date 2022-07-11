from src.models import Item

from tests.api import APITestCase


class SentryItemOptionsTest(APITestCase):
    endpoint = 'get_item_options'
    method = 'get'

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)
        self.item = self.create_item(self.organization)
        self.initial_item_count = 1

    def test_sentry_item_options(self):
        response = self.get_success_response(installationId=self.sentry_installation.uuid)
        assert len(response.json) == self.initial_item_count
        # Check that the options are all valid
        for option in response.json:
            assert option.get('value') is not None
            assert option.get('label') is not None
