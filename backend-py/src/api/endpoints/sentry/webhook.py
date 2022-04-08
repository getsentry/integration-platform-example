from __future__ import annotations

from typing import Any, Mapping

from src import app
from src.api.middleware import verify_sentry_signature
from src.database import db_session
from src.models import SentryInstallation, Organization
from src.api.endpoints.sentry.handlers import issue_handler

from flask import request, Response


@app.route("/api/sentry/webhook/", methods=["POST"])
@verify_sentry_signature()
def webhook_index():
    # Parse the JSON body fields off of the request
    action = request.json.get("action")
    data = request.json.get("data")
    uuid = request.json.get("installation", {}).get("uuid")
    # Identify the resource triggering the webhook in Sentry
    resource = request.headers.get("sentry-hook-resource")
    if not (action and data and uuid and resource):
        return Response('', 400)
    app.logger.info(f"Received '{resource}.{action}' webhook from Sentry")

    # If there is no associated installation, ignore the webhook
    # Note: We can drop webhooks without installations because we specified a
    #       Redirect URL on our Sentry Integration, so setup.py handles it.
    #       If we didn't set the Redirect URL we'd have to handle it here by
    #       creating an installation for 'installation.created' webhoooks.
    #       e.g. if resource == 'installation' and action == 'created':
    #               create_sentry_installation(...)
    sentry_installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not sentry_installation:
        return Response('', 404)

    # Handle webhooks related to issues
    if resource == 'issue':
        return issue_handler(action, sentry_installation, data)

    # Handle uninstallation webhooks
    if resource == "installation" and action == "deleted":
        return handle_uninstall(data.get("installation"))

    # We can monitor what status codes we're sending from the integration dashboard
    return Response('', 200)


def handle_uninstall(install_data: Mapping[str, Any]) -> int:
    uuid = install_data["uuid"]
    installation_slug = install_data["app"]["slug"]

    sentry_installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not sentry_installation:
        return Response('', 404)

    # This is where you could destroy any associated data you've created
    # alongside the installation.
    organization = Organization.query.filter(
        Organization.id == sentry_installation.organization_id
    ).first()
    organization.external_slug = None
    db_session.delete(sentry_installation)
    db_session.commit()
    app.logger.info(
        f"Uninstalled {installation_slug} from '{organization.name}'")
    return Response('', 204)
