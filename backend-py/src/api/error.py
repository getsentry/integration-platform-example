from werkzeug.exceptions import NotFound

from src import app


@app.errorhandler(NotFound)
def handle_not_found(error):
    return "404", 404
