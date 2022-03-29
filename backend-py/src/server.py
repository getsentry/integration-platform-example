from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask import Flask

load_dotenv()
USER = os.getenv("POSTGRES_USER")
PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB = os.getenv("POSTGRES_DB")
FLASK_ENV = os.getenv("FLASK_ENV")

if FLASK_ENV == "test":
    HOST = "localhost"
    PORT = 6001
else:
    HOST = "database"
    PORT = 5432

DATABASE = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB}"


def create_app(config=None):
    flask_app = Flask(__name__, instance_relative_config=True)
    CORS(flask_app)
    flask_app.config.from_mapping(config or {"DATABASE": DATABASE})
    return flask_app


app = create_app()

__all__ = ("app",)
