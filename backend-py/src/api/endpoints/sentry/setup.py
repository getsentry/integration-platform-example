from __future__ import annotations

import os

import requests
from dotenv import load_dotenv
from flask import redirect, request

from src import app
from src.database import db_session
from src.models import SentryInstallation

load_dotenv()
SENTRY_CLIENT_ID = os.getenv("SENTRY_CLIENT_ID")
SENTRY_CLIENT_SECRET = os.getenv("SENTRY_CLIENT_SECRET")
SENTRY_URL = os.getenv("SENTRY_URL")


@app.route("/api/sentry/setup/", methods=["GET"])
def setup_index():
    # Get the query params from the installation prompt.
    code = request.args.get("code")
    uuid = request.args.get("installationId")
    organization_slug = request.args.get("orgSlug")

    # Construct a payload to ask Sentry for a token on the basis that a user is installing.
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": SENTRY_CLIENT_ID,
        "client_secret": SENTRY_CLIENT_SECRET,
    }

    # Send that payload to Sentry and parse its response.
    token_response = requests.post(
        f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/",
        json=payload,
    )

    # Get the JSON body fields from the auth call.
    token_data = token_response.json()
    token = token_data.get("token")
    refresh_token = token_data.get("refreshToken")
    expires_at = token_data.get("expiresAt")

    # Store the token data (i.e. token, refreshToken, expiresAt) for future requests.
    # - Make sure to associate the installationId and the tokenData since it's
    #   unique to the organization.
    # - Using the wrong token for a different installation will result 401 Unauthorized responses.
    installation = SentryInstallation(
        uuid=uuid,
        org_slug=organization_slug,
        token=token,
        refresh_token=refresh_token,
        expires_at=expires_at,
    )
    db_session.add(installation)
    db_session.commit()

    # Verify the installation to inform Sentry of the success.
    # - This step is only required if you have enabled 'Verify Installation' on your integration.
    verify_response = requests.put(
        f"{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/",
        json={"status": "installed"},
        headers={"Authorization": f"Bearer {token}"}
    )

    # Get the JSON body fields from the verify call.
    verify_data = verify_response.json()
    app_slug = verify_data.get("app")["slug"]

    # Continue the installation process.
    # - If your app requires additional configuration, do it here.
    # - The token/refreshToken can be used to make requests to Sentry's API
    #   (See https://docs.sentry.io/api/.)
    # - You can optionally redirect the user back to Sentry as we do below.
    print(f"Installed {app_slug} on '{organization_slug}'")
    return redirect(
        f"{SENTRY_URL}/settings/{organization_slug}/sentry-apps/{app_slug}/",
        code=302
    )
