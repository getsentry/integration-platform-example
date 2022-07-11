from src.models import Organization

from . import OrganizationsApiTestBase


class OrganizationsApiPutTest(OrganizationsApiTestBase):
    method = "put"

    def test_put(self):
        external_slug = "New Slug"
        new_data = {"externalSlug": external_slug}
        self.get_success_response(organization_slug=self.organization.slug, data=new_data)

        organization = Organization.query.filter(Organization.id == self.organization.id).first()
        assert organization.external_slug == external_slug

    def test_put_empty(self):
        self.get_error_response(organization_slug=self.organization.slug, status_code=400)
