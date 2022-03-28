from . import UsersApiTestBase


class UsersApiIndexTest(UsersApiTestBase):
    def setUp(self):
        super().setUp()

        other_organization = self.create_organization("other")
        other_user = self.create_user(other_organization, "other user")

    def test_index(self):
        response = self.get_success_response()
        assert len(response.json) == 2

    def test_index_organization(self):
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["organizationId"] == self.organization.id
