from src.models import User

from . import UsersApiTestBase


class UsersApiPutTest(UsersApiTestBase):
    method = "put"

    def test_put(self):
        new_name = "New Name"
        new_data = {"name": new_name}
        self.get_success_response(user_id=self.user.id, data=new_data)

        user = User.query.filter(User.id == self.user.id).first()
        assert user.name == new_name

    def test_put_empty(self):
        self.get_error_response(user_id=self.user.id, status_code=400)

    def test_put_invalid(self):
        invalid_data = dict(assignee_id="invalid")
        self.get_error_response(
            user_id=self.user.id, data=invalid_data, status_code=400
        )
