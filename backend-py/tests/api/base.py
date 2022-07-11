from __future__ import annotations

import unittest
from typing import Any, Mapping

from flask import Response, url_for

from src import app
from src.database import clear_tables, db_session
from src.models import Item, Organization, User, SentryInstallation

from tests import fixtures


def assert_status_code(response, minimum: int, maximum: int | None = None) -> None:
    # Omit max to assert status_code == minimum.
    maximum = maximum or minimum + 1
    assert minimum <= response.status_code < maximum, (response.status_code, response.data)


class APITestCase(unittest.TestCase):
    """
    Extend APITestCase to inherit access to `client`, an object with methods
    that simulate API calls to Sentry, and the helper `get_response`, which
    combines and simplify a lot of tedious parts of making API calls in tests.
    When creating API tests, use a new class per endpoint-method pair. The class
    must set the string `endpoint`.
    """

    endpoint: str
    method: str = 'get'

    def setUp(self):
        db_session.commit()
        clear_tables()
        self.client = app.test_client()

    def get_response(
        self,
        data: Mapping[str, Any] | None = None,
        headers: Mapping[str, Any] | None = None,
        **kwargs: Any,
    ) -> Response:
        """Simulate an API call to the test case's URI and method."""
        if not self.endpoint:
            raise Exception('Implement self.endpoint to use this method.')

        with app.test_request_context():
            return getattr(self.client, self.method)(
                path=url_for(self.endpoint, **kwargs),
                json=(data or {}),
                headers=(headers or {})
            )

    def get_success_response(self, **kwargs):
        """
        Call `get_response` (see above) and assert the response's status code.

        :param kwargs:
            * status_code: (Optional) Assert that the response's status code is
            a specific code. Omit to assert any successful status_code.
        :returns Response object
        """
        status_code = kwargs.pop('status_code', None)

        if status_code and status_code >= 400:
            raise Exception('status_code must be < 400')

        response = self.get_response(**kwargs)

        if status_code:
            assert_status_code(response, status_code)
        else:
            assert_status_code(response, 200, 300)

        return response

    def get_error_response(self, **kwargs):
        """
        Call `get_response` (see above) and assert that the response's status
        code is an error code. Basically it's syntactic sugar.

        :param kwargs:
            * status_code: (Optional) Assert that the response's status code is
            a specific error code. Omit to assert any error status_code.
        :returns Response object
        """
        status_code = kwargs.pop('status_code', None)

        if status_code and status_code < 400:
            raise Exception('status_code must be >= 400 (an error status code)')

        response = self.get_response(**kwargs)

        if status_code:
            assert_status_code(response, status_code)
        else:
            assert_status_code(response, 400, 600)

        return response

    @staticmethod
    def create_user(organization: Organization, name: str = 'Test User') -> Organization:
        return fixtures.create_user(db_session, organization, name)

    @staticmethod
    def create_organization(name: str = 'Organization') -> Organization:
        return fixtures.create_organization(db_session, name)

    @staticmethod
    def create_item(
        organization: Organization,
        user: User | None = None,
        title: str = 'Item Title',
        **item_kwargs,
    ) -> Item:
        return fixtures.create_item(db_session, organization, user, title, **item_kwargs)

    @staticmethod
    def create_sentry_installation(
        organization: Organization,
    ) -> SentryInstallation:
        return fixtures.create_sentry_installation(db_session, organization)
