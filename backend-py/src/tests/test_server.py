def test_server(client):
    response = client.get("/")
    assert b"Hello World" in response.data
