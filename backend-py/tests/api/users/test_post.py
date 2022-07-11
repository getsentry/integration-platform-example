from src.models import User

from . import UsersApiTestBase


class UsersApiPostTest(UsersApiTestBase):
    method = "post"

    def test_post(self):
        new_name = "New Name"
        new_data = {"name": new_name, "organizationId": self.organization.id}

        response = self.get_success_response(data=new_data)
        assert response.json["name"] == new_name

        user_id = response.json["id"]
        assert User.query.filter(User.id == user_id).first()

    def test_post_invalid(self):
        new_data = {"organizationId": "invalid"}

        self.get_error_response(data=new_data, status_code=400)
