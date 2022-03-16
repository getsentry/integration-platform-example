from tests.api import APITestCase


class ServerTest(APITestCase):
    def test_server(self):
        response = self.client.get("/")
        assert b"Hello World" in response.data


