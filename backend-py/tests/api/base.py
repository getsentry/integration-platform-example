import unittest

from src import app


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
