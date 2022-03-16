from .server import app
from . import database # NOQA

# Register routes.
with app.app_context():
    from . import api  # NOQA

__all__ = ("app",)
