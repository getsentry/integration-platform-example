from __future__ import annotations

import hashlib
import hmac
import os
import functools
from typing import Any, Mapping

from dotenv import load_dotenv
from flask import request, Response

from src import app

load_dotenv()
FLASK_ENV = os.getenv("FLASK_ENV")
SENTRY_CLIENT_SECRET = os.getenv("SENTRY_CLIENT_SECRET")

# There are few hacks in this verification step (denoted with HACK) that we at Sentry hope
# to migrate away from in the future. Presently however, for legacy reasons, they are
# necessary to keep around, so we've shown how to deal with them here.


def is_correct_sentry_signature(
    body: Mapping[str, Any], key: str, expected: str
) -> bool:
    digest = hmac.new(
        key=key.encode("utf-8"),
        msg=body,
        digestmod=hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(digest, expected):
        return False

    app.logger.info("Authorized: Verified request came from Sentry")
    return True


def verify_sentry_signature():
    """
    This function will authenticate that the requests are coming from Sentry.
    It allows us to be confident that all the code run after this middleware are
    using verified data sent directly from Sentry.
    """

    def wrapper(f):
        @functools.wraps(f)
        def inner(*args: Any, **kwargs: Any):
            # HACK: We need to use the raw request body since Flask will throw a 400 Bad Request
            # if we try to use request.json. This is because Sentry sends an empty body (i.e. b'')
            # with a Content-Type of application/json for some requests.
            raw_body = request.get_data()
            if (
                FLASK_ENV != "test"
                # HACK: The signature header may be one of these two values
                and not is_correct_sentry_signature(
                    body=raw_body,
                    key=SENTRY_CLIENT_SECRET,
                    expected=request.headers.get("sentry-hook-signature"),
                )
                and not is_correct_sentry_signature(
                    body=raw_body,
                    key=SENTRY_CLIENT_SECRET,
                    expected=request.headers.get("sentry-app-signature"),
                )
            ):
                app.logger.info(
                    "Unauthorized: Could not verify request came from Sentry"
                )
                return Response("", 401)
            return f(*args, **kwargs)

        return inner

    return wrapper
