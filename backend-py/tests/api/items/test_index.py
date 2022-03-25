from . import ItemsApiTestBase


class ItemsApiIndexTest(ItemsApiTestBase):
    def setUp(self):
        super().setUp()

        other_organization = self.create_organization("other")
        other_user = self.create_user(other_organization, "other user")
        self.create_item(other_organization, other_user)

    def test_index(self):
        response = self.get_success_response()
        assert len(response.json) == 2

    def test_index_user(self):
        response = self.get_success_response(user=self.user.id)

        assert len(response.json) == 1
        assert response.json[0]["assignee_id"] == self.user.id

    def test_index_organization(self):
        response = self.get_success_response(organization=self.organization.slug)
        assert len(response.json) == 1
        assert response.json[0]["organization_id"] == self.organization.id
