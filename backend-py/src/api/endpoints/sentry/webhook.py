from __future__ import annotations

from typing import Any, Mapping

from src import app
from src.api.middleware.auth import verify_sentry_signature
from src.database import db_session
from src.models import SentryInstallation

from flask import request


@app.route("/api/sentry/webhook/", methods=["POST"])
@verify_sentry_signature()
def webhook_index():
    # Get the JSON parameters.
    action = request.json.get("action")
    data = request.json.get("data")

    resource = request.headers.get("sentry-hook-resource")

    if resource == "installation" and action == "deleted":
        handle_uninstall(data["installation"])

    return '', 200


def handle_uninstall(installation: Mapping[str, Any]) -> None:
    if not installation:
        return None

    uuid = installation["uuid"]
    installation_slug = installation["app"]["slug"]
    organization_slug = installation["organization"]["slug"]

    installation_option = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not installation_option:
        return None

    # This is where you could destroy any associated data you've created
    # alongside the installation.
    db_session.delete(installation_option)
    db_session.commit()

    print(f"Uninstalled {installation_slug} from '{organization_slug}'")
