from flask import jsonify, Response
from werkzeug.exceptions import NotFound

from src import app


@app.errorhandler(NotFound)
def handle_not_found(error) -> Response:
    response = jsonify(error)
    response.status_code = 400
    return response
