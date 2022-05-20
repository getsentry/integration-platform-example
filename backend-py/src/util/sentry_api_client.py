
import os
from dotenv import load_dotenv
from datetime import datetime
import requests

from src import app
from src.database import db_session
from src.models import Organization, SentryInstallation

load_dotenv()


class SentryAPIClient:

    def __init__(self, token):
        self.token = token

    @staticmethod
    def get_sentry_api_token(organization: Organization):
        """
        Fetches an organization's Sentry API token, refreshing it if necessary.
        """
        sentry_installation = SentryInstallation.query.filter(
            SentryInstallation.organization_id == organization.id
        ).first()

        # If the token is not expired, no need to refresh it
        if (sentry_installation.expires_at.timestamp() > datetime.now().timestamp()):
            return sentry_installation.token

        # If the token is expired, we'll need to refresh it...
        app.logger.info(f'Token for {sentry_installation.org_slug} has expired. Refreshing...')
        # Construct a payload to ask Sentry for a new token
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': sentry_installation.refresh_token,
            'client_id': os.getenv('SENTRY_CLIENT_ID'),
            'client_secret': os.getenv('SENTRY_CLIENT_SECRET'),
        }

        # Send that payload to Sentry and parse the response
        token_response = requests.post(
            url=(
                f"{os.getenv('SENTRY_URL')}/api/0/sentry-app-installations/"
                f"{sentry_installation.uuid}/authorizations/"
            ),
            json=payload,
        ).json()

        # Store the token information for future requests
        sentry_installation.token = token_response['token']
        sentry_installation.refresh_token = token_response['refreshToken']
        sentry_installation.expires_at = token_response['expiresAt']
        db_session.commit()
        app.logger.info(f"Token for '{sentry_installation.org_slug}' has been refreshed.")

        # Return the newly refreshed token
        return sentry_installation.token

    # We create a static wrapper on the constructor to ensure our token is always refreshed
    @ staticmethod
    def create(organization: Organization) -> 'SentryAPIClient':
        token = SentryAPIClient.get_sentry_api_token(organization)
        return SentryAPIClient(token)

    def request(self, method: str, path: str, data: dict = None) -> requests.Response:
        response = requests.request(
            method=method,
            url=f"{os.getenv('SENTRY_URL')}/api/0{path}",
            headers={"Authorization": f"Bearer {self.token}"},
            data=data
        )
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as e:
            # TODO(you): Catch these sorta errors in Sentry!
            app.logger.error(f"Error while making a request to Sentry: {e}")
        return response

    def get(self, path: str) -> requests.Response:
        return self.request("GET", path)

    # TODO(you): Extend as you see fit!
