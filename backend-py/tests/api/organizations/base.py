from __future__ import annotations

from tests.api import APITestCase


class OrganizationsApiTestBase(APITestCase):
    endpoint = 'organization_api'

    def setUp(self):
        super().setUp()

        self.organization = self.create_organization()
