from flask import Flask


def create_app(config=None):
    server = Flask(__name__, instance_relative_config=True)
    server.config.from_mapping(config or {})

    @server.route("/")
    def hello_world():
        print("Getting here")
        return "<p>Hello World!</p>"

    return server
