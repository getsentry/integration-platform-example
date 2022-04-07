import json
import os
import responses

from src.models import Item
from src.database import db_session

from tests.api import APITestCase
from tests.mocks import MOCK_ISSUE_LINK, ISSUE


class CreateIssueLinkTest(APITestCase):
    endpoint = "create_issue_link"
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)
        self.initial_item_count = Item.query.count()

    def test_create_issue_link(self):
        # Check that no item exists
        assert Item.query.count() == self.initial_item_count
        # Check that the response was appropriate
        response = self.get_success_response(data=MOCK_ISSUE_LINK)
        assert response.json.get("webUrl") is not None
        assert response.json.get("project") == "IPE-DEMO"
        # Check that item was created properly
        new_issue_id = response.json.get("identifier")
        item = Item.query.filter(Item.id == new_issue_id).first()
        for field in ["title", "description", "complexity"]:
            assert getattr(item, field) == MOCK_ISSUE_LINK["fields"].get(field)
        assert item.column.value == MOCK_ISSUE_LINK["fields"]["column"]
        assert item.sentry_id == MOCK_ISSUE_LINK["issueId"]


class LinkIssueLinkTest(APITestCase):
    endpoint = "link_issue_link"
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)
        self.item = self.create_item(self.organization)
        db_session.commit()
        payload = MOCK_ISSUE_LINK
        payload["fields"]["itemId"] = self.item.id
        self.payload = payload
        self.initial_item_count = Item.query.count()

    def test_link_issue_link(self):
        # Check the item exists and is unlinked
        assert Item.query.count() == self.initial_item_count
        assert self.item.sentry_id is None
        # Check that the existing item was updated
        response = self.get_success_response(data=self.payload)
        assert Item.query.count() == self.initial_item_count
        assert self.item.sentry_id == self.payload["issueId"]
        # Check that the response was appropriate
        assert response.json.get("webUrl") is not None
        assert response.json.get("project") == "IPE-DEMO"
        assert response.json.get("identifier") == str(self.item.id)