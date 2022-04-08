from __future__ import annotations


import os
from src import app
from src.api.middleware import verify_sentry_signature
from src.models import SentryInstallation, Item, Organization
from src.models.items import ItemColumn
from src.database import db_session

from flask import jsonify, request, Response

REACT_APP_PORT = os.getenv("REACT_APP_PORT")


@app.route("/api/sentry/issue-link/create/", methods=["POST"])
@verify_sentry_signature()
def create_issue_link() -> Response:
    # Get the associated organization.
    uuid = request.json.get("installationId")
    organization = Organization.query.join(SentryInstallation).filter(
        SentryInstallation.uuid == uuid).first()
    if not organization:
        return Response('', 404)

    # The blob with the key "create" beside {"type": "issue-link"} in integration-schema.json
    # specifies the fields we'll have access to in this endpoint (on user_link_data).
    user_link_data = request.json.get("fields")

    # Create an item in our application from the Sentry Issue and user provided data.
    item = Item(
        title=user_link_data.get("title"),
        description=user_link_data.get("description"),
        column=user_link_data.get("column", ItemColumn.Todo),
        complexity=user_link_data.get("complexity", 0),
        organization_id=organization.id,
        sentry_id=request.json.get("issueId"),
    )
    db_session.add(item)
    db_session.commit()
    app.logger.info("Created item through Sentry Issue Link UI Component")

    # Respond to Sentry with the exact fields it requires to complete the link.
    return jsonify({
        "webUrl": f"http://localhost:{REACT_APP_PORT}/{organization.slug}/",
        "project": "IPE-DEMO",
        "identifier": f"{item.id}",
    }), 201


@app.route("/api/sentry/issue-link/link/", methods=["POST"])
@verify_sentry_signature()
def link_issue_link() -> Response:
    # Get the associated organization.
    uuid = request.json.get("installationId")
    organization = Organization.query.join(SentryInstallation).filter(
        SentryInstallation.uuid == uuid).first()
    if not organization:
        return Response('', 404)

    # The blob with the key "link" beside {"type": "issue-link"} in integration-schema.json
    # specifies the fields we'll have access to in this endpoint (on user_link_data).
    user_link_data = request.json.get("fields")

    # Associate the Sentry Issue with the item from our application the user selected.
    item = Item.query.filter(Item.id == user_link_data.get("itemId")).first()
    item.sentry_id = request.json.get("issueId")
    db_session.commit()
    app.logger.info("Linked item through Sentry Issue Link UI Component")

    # Respond to Sentry with the exact fields it requires to complete the link.
    return jsonify({
        "webUrl": f"http://localhost:{REACT_APP_PORT}/{organization.slug}/",
        "project": "IPE-DEMO",
        "identifier": f"{item.id}",
    }), 200
