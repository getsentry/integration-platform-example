from . import OrganizationsApiTestBase

from src.models import Organization


class OrganizationsApiDeleteTest(OrganizationsApiTestBase):
    method = 'delete'

    def test_delete(self):
        self.get_success_response(organization_slug=self.organization.slug)
        assert Organization.query.count() == 0

    def test_delete_not_found(self):
        self.get_error_response(organization_slug='invalid', status_code=404)
