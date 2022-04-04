
from src.models import Item, User
from src.types import ItemColumn

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK, ISSUE


class IssueHandlerWebhookTest(APITestCase):
    endpoint = "webhook_index"
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)

    def test_issue_assigned(self):
        self.get_success_response(
            data=MOCK_WEBHOOK["issue.assigned"],
            headers={"sentry-hook-resource": "issue"},
            status_code=202
        )
        item = Item.query.filter(Item.sentry_id == ISSUE["id"]).first()
        assert item
        user = User.query.filter(User.username == ISSUE["assignedTo"]["email"]).first()
        assert user
        assert item.assignee_id == user.id

    def test_issue_created(self):
        self.get_success_response(
            data=MOCK_WEBHOOK["issue.created"],
            headers={"sentry-hook-resource": "issue"},
            status_code=201
        )
        item = Item.query.filter(Item.sentry_id == ISSUE["id"]).first()
        assert item
        assert item.title == ISSUE["title"]
        assert item.description == f"{ISSUE['shortId']} - {ISSUE['culprit']}"
        assert item.is_ignored == False
        assert item.column.value == ItemColumn.Todo.value
        assert item.sentry_id == ISSUE["id"]

        assert item.organization_id == self.sentry_installation.organization_id

    def test_issue_ignored(self):
        self.get_success_response(
            data=MOCK_WEBHOOK["issue.ignored"],
            headers={"sentry-hook-resource": "issue"},
            status_code=202
        )
        item = Item.query.filter(Item.sentry_id == ISSUE["id"]).first()
        assert item
        assert item.is_ignored == True

    def test_issue_resolved(self):
        self.get_success_response(
            data=MOCK_WEBHOOK["issue.resolved"],
            headers={"sentry-hook-resource": "issue"},
            status_code=202
        )
        item = Item.query.filter(Item.sentry_id == ISSUE["id"]).first()
        assert item
        assert item.column.value == ItemColumn.Done.value

    def test_issue_unknown_action(self):
        self.get_error_response(
            data={**MOCK_WEBHOOK["issue.assigned"], "action": "bookmarked"},
            headers={"sentry-hook-resource": "issue"},
            status_code=400
        )
        item = Item.query.filter(Item.sentry_id == ISSUE["id"]).first()
        assert item == None
