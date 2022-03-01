import os

from dotenv import load_dotenv
from flask import Flask

load_dotenv()

server = Flask(__name__)


@server.route("/")
def hello_world():
    return "<p>Hello World!</p>"


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=os.environ.get("BACKEND_PORT"))
