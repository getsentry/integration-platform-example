from __future__ import annotations

from tests.api import APITestCase


class UsersApiTestBase(APITestCase):
    endpoint = "user_api"

    def setUp(self):
        super().setUp()

        self.organization = self.create_organization()
        self.user = self.create_user(self.organization)
