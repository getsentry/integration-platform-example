from . import UsersApiTestBase

from src.models import User


class UsersApiDeleteTest(UsersApiTestBase):
    method = 'delete'

    def test_delete(self):
        self.get_success_response(user_id=self.user.id)
        assert User.query.count() == 0

    def test_delete_not_found(self):
        self.get_error_response(user_id=0, status_code=404)
