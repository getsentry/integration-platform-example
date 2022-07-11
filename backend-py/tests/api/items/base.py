from __future__ import annotations

from tests.api import APITestCase


class ItemsApiTestBase(APITestCase):
    endpoint = 'item_api'

    def setUp(self):
        super().setUp()

        self.organization = self.create_organization()
        self.user = self.create_user(self.organization)
        self.item = self.create_item(self.organization, self.user)
        self.sentry_installation = self.create_sentry_installation(self.organization)
