import json
import os
import responses
from dotenv import load_dotenv

from . import ItemsApiTestBase
from src.database import db_session


load_dotenv()
SENTRY_URL = os.getenv("SENTRY_URL")


class ItemsApiIndexTest(ItemsApiTestBase):
    def setUp(self):
        super().setUp()

        other_organization = self.create_organization("other")
        other_user = self.create_user(other_organization, "other user")
        self.create_item(other_organization, other_user)

    def test_index(self):
        response = self.get_success_response()
        assert len(response.json) == 2

    def test_index_user(self):
        response = self.get_success_response(user=self.user.id)

        assert len(response.json) == 1
        assert response.json[0]["assigneeId"] == self.user.id

    def test_index_organization(self):
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["organizationId"] == self.organization.id

    @responses.activate
    def test_index_with_sentry_api(self):
        sentry_id = "12345"
        short_id = "PROJ-123"

        responses.add(
            responses.GET,
            f"{SENTRY_URL}/api/0/issues/{sentry_id}/",
            body=json.dumps({"shortId": short_id}),
        )

        self.item.sentry_id = sentry_id
        db_session.commit()
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["sentryId"] == short_id

    @responses.activate
    def test_index_with_failing_sentry_api(self):
        sentry_id = "12345"

        responses.add(
            responses.GET,
            f"{SENTRY_URL}/api/0/issues/{sentry_id}/",
            body=json.dumps({}),
        )

        self.item.sentry_id = sentry_id
        db_session.commit()
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["sentryId"] == sentry_id
