from dotenv import load_dotenv
from flask import Flask

load_dotenv()

server = Flask(__name__)


def create_app(config={}):
    server = Flask(__name__, instance_relative_config=True)
    server.config.from_mapping(config)

    @server.route("/")
    def hello_world():
        print("Getting here")
        return "<p>Hello World!</p>"

    return server
