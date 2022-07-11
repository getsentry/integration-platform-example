from . import OrganizationsApiTestBase


class OrganizationsApiIndexTest(OrganizationsApiTestBase):
    def test_index(self):
        self.create_organization("other")

        response = self.get_success_response()
        assert len(response.json) == 2
