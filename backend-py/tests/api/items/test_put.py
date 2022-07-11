from src.models import Item

from . import ItemsApiTestBase


class ItemsApiPutTest(ItemsApiTestBase):
    method = 'put'

    def test_put(self):
        new_title = 'New Title'
        new_data = {'title': new_title}
        self.get_success_response(item_id=self.item.id, data=new_data)

        item = Item.query.filter(Item.id == self.item.id).first()
        assert item.title == 'New Title'

    def test_put_empty(self):
        self.get_error_response(item_id=self.item.id, status_code=400)

    def test_put_invalid(self):
        invalid_data = {'assigneeId': 'invalid'}
        self.get_error_response(item_id=self.item.id, data=invalid_data, status_code=400)
