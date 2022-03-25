from . import ItemsApiTestBase

from src.models import Item


class ItemsApiDeleteTest(ItemsApiTestBase):
    method = "delete"

    def test_delete(self):
        self.get_success_response(item_id=self.item.id)
        assert Item.query.count() == 0

    def test_delete_not_found(self):
        self.get_error_response(item_id=0, status_code=404)
