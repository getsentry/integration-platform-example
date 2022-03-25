from src.models import Item

from . import ItemsApiTestBase


class ItemsApiPostTest(ItemsApiTestBase):
    method = "post"

    def test_post(self):
        new_title = "New Title"
        new_data = {
            "title": new_title,
            "organizationId": self.organization.id
        }

        response = self.get_success_response(data=new_data)
        assert response.json["title"] == new_title

        item_id = response.json["id"]
        assert Item.query.filter(Item.id == item_id).first()

    def test_post_invalid(self):
        new_data = {"organizationId": "invalid"}

        self.get_error_response(data=new_data, status_code=400)
