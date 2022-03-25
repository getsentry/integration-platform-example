from . import ItemsApiTestBase


class ItemsApiGetTest(ItemsApiTestBase):
    def test_get_not_found(self):
        self.get_error_response(item_id=0, status_code=404)

    def test_get(self):
        item = self.create_item(self.organization, self.user, title="unique title")

        response = self.get_success_response(item_id=item.id)
        assert response.json["title"] == item.title
