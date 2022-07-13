import copy

from src.database import db_session
from src.types import ItemComment, JSONData

from tests.api import APITestCase
from tests.mocks import MOCK_WEBHOOK, ISSUE


class CommentHandlerWebhookTest(APITestCase):
    endpoint = "webhook_index"
    method = "post"

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)
        self.item = self.create_item(self.organization, sentry_id=ISSUE["id"])

    def assert_comment_from_payload(self, comment: ItemComment, payload: JSONData):
        assert comment["text"] == payload["data"]["comment"]
        assert comment["author"] == payload["actor"]["name"]
        assert comment["timestamp"] == payload["data"]["timestamp"]
        assert comment["sentryCommentId"] == payload["data"]["comment_id"]

    def test_unlinked_issue_comment(self):
        payload = copy.deepcopy(MOCK_WEBHOOK["comment.created"])
        payload["data"]["issue_id"] = "90210"
        self.get_success_response(
            data=payload, headers={"sentry-hook-resource": "comment"}, status_code=200
        )

    def test_comment_created(self):
        payload = MOCK_WEBHOOK["comment.created"]
        self.get_success_response(
            data=payload, headers={"sentry-hook-resource": "comment"}, status_code=201
        )
        assert len(self.item.comments) == 1
        new_comment = self.item.comments[0]
        assert new_comment["text"] == payload["data"]["comment"]
        assert new_comment["author"] == payload["actor"]["name"]
        assert new_comment["timestamp"] == payload["data"]["timestamp"]
        assert new_comment["sentryCommentId"] == payload["data"]["comment_id"]

    def test_comment_updated(self):
        payload = MOCK_WEBHOOK["comment.updated"]
        self.item.comments = [
            {
                "text": "old comment",
                "author": payload["actor"]["name"],
                "timestamp": payload["data"]["timestamp"],
                "sentryCommentId": payload["data"]["comment_id"],
            }
        ]
        db_session.commit()
        assert len(self.item.comments) == 1

        self.get_success_response(
            data=payload, headers={"sentry-hook-resource": "comment"}, status_code=200
        )
        assert len(self.item.comments) == 1
        existing_comment = self.item.comments[0]
        assert existing_comment["text"] == payload["data"]["comment"]

    def test_comment_deleted(self):
        payload = MOCK_WEBHOOK["comment.deleted"]
        self.item.comments = [
            {
                "sentryCommentId": payload["data"]["comment_id"],
                "timestamp": payload["data"]["timestamp"],
                "author": payload["actor"]["name"],
                "text": payload["data"]["comment"],
            },
            {
                "sentryCommentId": "90210",
                "timestamp": payload["data"]["timestamp"],
                "author": payload["actor"]["name"],
                "text": "untouched comment",
            },
        ]
        db_session.commit()
        assert len(self.item.comments) == 2

        self.get_success_response(
            data=payload, headers={"sentry-hook-resource": "comment"}, status_code=204
        )
        assert len(self.item.comments) == 1
