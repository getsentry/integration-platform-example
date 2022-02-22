import os
from flask import Flask

server = Flask(__name__)


@server.route("/")
def hello_world():
    return "<p>Hello World!</p>"


if __name__ == "__main__":
    server.run(port=os.environ.get('SERVER_PORT'))
