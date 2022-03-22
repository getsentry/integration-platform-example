from tests.api import APITestCase


class ServerTest(APITestCase):
    def test_server(self):
        response = self.client.get("/api/items/")
        assert b"[]" in response.data

    def test_not_found(self):
        response = self.client.get("/")
        assert b"404" in response.data
