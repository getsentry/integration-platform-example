from . import UsersApiTestBase


class UsersApiGetTest(UsersApiTestBase):
    def test_get_not_found(self):
        self.get_error_response(user_id=0, status_code=404)

    def test_get(self):
        user = self.create_user(self.organization, name='Unique Name')

        response = self.get_success_response(user_id=user.id)
        assert response.json['avatar'] == user.avatar
