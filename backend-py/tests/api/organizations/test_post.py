from src.models import Organization

from . import OrganizationsApiTestBase


class OrganizationsApiPostTest(OrganizationsApiTestBase):
    method = 'post'

    def test_post(self):
        new_name = 'New Title'
        new_data = {
            'name': new_name,
            'slug': 'new-slug',
            'externalSlug': 'external-slug',
        }

        response = self.get_success_response(data=new_data)
        assert response.json['name'] == new_name

        organization_id = response.json['id']
        assert Organization.query.filter(Organization.id == organization_id).first()

    def test_post_invalid(self):
        new_data = {'slug': self.organization.slug}

        self.get_error_response(data=new_data, status_code=400)
