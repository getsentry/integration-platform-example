from tests.api import APITestCase


class ServerTest(APITestCase):
    def test_not_found(self):
        response = self.client.get("/")
        assert response.status_code == 404
