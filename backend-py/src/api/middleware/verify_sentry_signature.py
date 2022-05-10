from __future__ import annotations

import hashlib
import hmac
import json
import os
import functools
from typing import Any, Mapping

from dotenv import load_dotenv
from flask import request, Response

from src import app

load_dotenv()
FLASK_ENV = os.getenv("FLASK_ENV")
SENTRY_CLIENT_SECRET = os.getenv("SENTRY_CLIENT_SECRET")


def is_correct_sentry_signature(
    body: Mapping[str, Any],
    key: str,
    expected: str
) -> bool:
    # The expected string is hashed assuming _no_ whitespace.
    body_encoded = json.dumps(body, separators=(',', ':')).encode("utf-8")
    digest = hmac.new(
        key=key.encode("utf-8"),
        msg=body_encoded,
        digestmod=hashlib.sha256,
    ).hexdigest()

    if digest != expected:
        app.logger.info("Unauthorized: Could not verify request came from Sentry")
        return False

    app.logger.info("Authorized: Verified request came from Sentry")
    return True


def verify_sentry_signature():
    """
    This function will authenticate that the requests are coming from Sentry.
    Now we can be confident in our nested routes that the data is legit,
    without having to repeat this check.
    """
    def wrapper(f):
        @functools.wraps(f)
        def inner(*args: Any, **kwargs: Any):
            if (
                # TODO(Leander): Continue signature verification once partners
                # have been notified of changes
                False and
                FLASK_ENV != "test"
                and not is_correct_sentry_signature(
                    body=request.json,
                    key=SENTRY_CLIENT_SECRET,
                    expected=request.headers.get("sentry-hook-signature")
                )
            ):
                return Response('', 401)
            return f(*args, **kwargs)
        return inner
    return wrapper
