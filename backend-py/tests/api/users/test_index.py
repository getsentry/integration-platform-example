from . import UsersApiTestBase


class UsersApiIndexTest(UsersApiTestBase):
    def setUp(self):
        super().setUp()

        other_organization = self.create_organization("other")
        self.create_user(other_organization, "other user")

    def test_index_requires_organization(self):
        self.get_error_response(status_code=400)

    def test_index_unknown_organization(self):
        self.get_error_response(organization="does-not-exist", status_code=404)

    def test_index_organization(self):
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["organizationId"] == self.organization.id
