from src.models import Item
from src.database import db_session

from tests.api import APITestCase
from tests.mocks import MOCK_ALERT_RULE_ACTION, ALERT_RULE_ACTION_VALUES


class AlertRuleActionTest(APITestCase):
    endpoint = 'alert_rule_action'
    method = 'post'

    def setUp(self):
        super().setUp()

    def test_handles_successful_request(self):
        organization = self.create_organization()
        self.create_sentry_installation(organization)
        user = self.create_user(organization)
        setattr(user, 'id', ALERT_RULE_ACTION_VALUES['userId'])
        db_session.commit()
        response = self.get_success_response(data=MOCK_ALERT_RULE_ACTION, status_code=200)

    def test_surfaces_errors(self):
        response = self.get_error_response(data=MOCK_ALERT_RULE_ACTION, status_code=400)
        assert response.json['message'] == 'Invalid installation was provided'

        organization = self.create_organization()
        self.create_sentry_installation(organization)
        response = self.get_error_response(data={**MOCK_ALERT_RULE_ACTION, 'fields': []})
        assert response.json['message'] == 'Title and description are required'

        response = self.get_error_response(data=MOCK_ALERT_RULE_ACTION)
        assert response.json['message'] == 'Selected user was not found'
