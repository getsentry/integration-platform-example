from __future__ import annotations

import os

import requests
from dotenv import load_dotenv
from flask import request

from src import app
from src.database import db_session
from src.models import SentryInstallation, Organization

load_dotenv()
SENTRY_CLIENT_ID = os.getenv('SENTRY_CLIENT_ID')
SENTRY_CLIENT_SECRET = os.getenv('SENTRY_CLIENT_SECRET')
SENTRY_URL = os.getenv('SENTRY_URL')


@app.route('/api/sentry/setup/', methods=['POST'])
def setup_index():
    # Get the query params from the installation prompt.
    code = request.json.get('code')
    uuid = request.json.get('installationId')
    sentry_org_slug = request.json.get('sentryOrgSlug')
    organization_id = request.json.get('organizationId')

    # Construct a payload to ask Sentry for a token on the basis that a user is installing.
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': SENTRY_CLIENT_ID,
        'client_secret': SENTRY_CLIENT_SECRET,
    }
    # Send that payload to Sentry and parse its response.
    token_response = requests.post(
        f'{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/authorizations/',
        json=payload,
    )

    # Get the JSON body fields from the auth call.
    token_data = token_response.json()
    token = token_data.get('token')
    refresh_token = token_data.get('refreshToken')
    expires_at = token_data.get('expiresAt')

    # Store the token data (i.e. token, refreshToken, expiresAt) for future requests.
    # - Make sure to associate the installationId and the tokenData since it's
    #   unique to the organization.
    # - Using the wrong token for a different installation will result 401 Unauthorized responses.
    organization = Organization.query.filter(Organization.id == organization_id).first()
    installation = SentryInstallation(
        uuid=uuid,
        org_slug=sentry_org_slug,
        token=token,
        refresh_token=refresh_token,
        expires_at=expires_at,
        organization_id=organization.id,
    )
    db_session.add(installation)
    db_session.commit()

    # Verify the installation to inform Sentry of the success.
    # - This step is only required if you have enabled 'Verify Installation' on your integration.
    verify_response = requests.put(
        f'{SENTRY_URL}/api/0/sentry-app-installations/{uuid}/',
        json={'status': 'installed'},
        headers={'Authorization': f'Bearer {token}'}
    )

    # Get the JSON body fields from the verify call.
    verify_data = verify_response.json()
    app_slug = verify_data.get('app')['slug']

    # Update the associated organization to connect it to Sentry's organization
    organization.external_slug = sentry_org_slug
    db_session.commit()

    # Continue the installation process.
    # - If your app requires additional configuration, do it here.
    # - The token/refreshToken can be used to make requests to Sentry's API
    # - You can optionally redirect the user back to Sentry as we do below.
    app.logger.info(f"Installed {app_slug} on '{organization.name}'")
    return {'redirectUrl': f'{SENTRY_URL}/settings/{sentry_org_slug}/sentry-apps/{app_slug}/'}, 201
