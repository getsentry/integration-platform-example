
from src.models import Item
from src.database import db_session

from tests.api import APITestCase
from tests.mocks import ALERT_RULE_ACTION_VALUES, MOCK_WEBHOOK, ISSUE, METRIC_ALERT


class AlertHandlerWebhookTest(APITestCase):
    endpoint = 'webhook_index'
    method = 'post'

    def setUp(self):
        super().setUp()
        self.organization = self.create_organization()
        self.sentry_installation = self.create_sentry_installation(self.organization)
        self.user = self.create_user(self.organization)
        self.user.id = ALERT_RULE_ACTION_VALUES['userId']
        db_session.commit()

    def test_event_alert_triggered(self):
        self.get_success_response(
            data=MOCK_WEBHOOK['event_alert.triggered'],
            headers={'sentry-hook-resource': 'event_alert'},
            status_code=202
        )
        item = Item.query.filter(Item.sentry_id == ISSUE['id']).first()
        assert item
        assert 'Issue Alert' in item.title

    def test_metric_alert_triggered(self):
        for action in ['resolved', 'warning', 'critical']:
            self.get_success_response(
                data=MOCK_WEBHOOK[f'metric_alert.{action}'],
                headers={'sentry-hook-resource': 'metric_alert'},
                status_code=202
            )
            items = Item.query.filter(Item.sentry_alert_id == METRIC_ALERT['id'])
            assert items.count() == 1
            item = items.first()
            assert item
            assert action in item.title.lower()

    def test_event_alert_with_alert_rule_actions(self):
        self.get_success_response(
            data=MOCK_WEBHOOK['event_alert.triggered:with_alert_rule_action'],
            headers={'sentry-hook-resource': 'event_alert'},
            status_code=202
        )
        item = Item.query.filter(Item.sentry_id == ISSUE['id']).first()
        assert item
        assert 'Issue Alert' in item.title
        assert ALERT_RULE_ACTION_VALUES['title'] in item.title
        assert ALERT_RULE_ACTION_VALUES['description'] in item.description
        assert ALERT_RULE_ACTION_VALUES['userId'] == item.assignee_id

    def test_metric_alert_with_alert_rule_actions(self):
        for action in ['warning', 'critical']:
            self.get_success_response(
                data=MOCK_WEBHOOK[f'metric_alert.{action}:with_alert_rule_action'],
                headers={'sentry-hook-resource': 'metric_alert'},
                status_code=202
            )
            items = Item.query.filter(Item.sentry_alert_id == METRIC_ALERT['id'])
            assert items.count() == 1
            item = items.first()
            assert item
            assert action in item.title.lower()
            assert ALERT_RULE_ACTION_VALUES['title'] in item.title
            assert ALERT_RULE_ACTION_VALUES['description'] in item.description
            assert ALERT_RULE_ACTION_VALUES['userId'] == item.assignee_id
