from . import OrganizationsApiTestBase


class OrganizationsApiGetTest(OrganizationsApiTestBase):
    def test_get_not_found(self):
        self.get_error_response(organization_slug='invalid', status_code=404)

    def test_get(self):
        organization = self.create_organization(name='unique-name')

        response = self.get_success_response(organization_slug=organization.slug)
        assert response.json['name'] == organization.name
