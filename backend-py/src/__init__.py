from .server import app
from . import database # NOQA

# Register routes and serializers.
with app.app_context():
    from .api import endpoints  # NOQA
    from .api import serializers  # NOQA

__all__ = ("app",)
