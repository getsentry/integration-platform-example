import os

from flask import Flask

server = Flask(__name__)

# Identify the path to the root-level .env file
env_path = os.path.join(os.path.dirname(__file__), "../../.env")

# Iterate through the file and set all environment variables
# with open(env_path, "r") as env:
#     var_name, var_value = env.readline().split("=")
#     os.environ[var_name] = var_value


@server.route("/")
def hello_world():
    print("Getting here")
    return "<p>Hello World!</p>"


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=os.environ.get("BACKEND_PORT"))
