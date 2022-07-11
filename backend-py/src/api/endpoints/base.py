from flask.views import View

from src import app


def register_api(
    view: View,
    endpoint: str,
    url: str,
    pk: str = "id",
    pk_type: str = "int",
) -> None:
    """See https://flask.palletsprojects.com/en/2.0.x/views/."""
    view_func = view.as_view(endpoint)
    app.add_url_rule(
        url,
        defaults={pk: None},
        view_func=view_func,
        methods=[
            "GET",
        ],
    )
    app.add_url_rule(
        url,
        view_func=view_func,
        methods=[
            "POST",
        ],
    )
    app.add_url_rule(
        f"{url}<{pk_type}:{pk}>", view_func=view_func, methods=["GET", "PUT", "DELETE"]
    )
