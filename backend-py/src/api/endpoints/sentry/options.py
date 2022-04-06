from __future__ import annotations


from src import app
from src.api.middleware.auth import verify_sentry_signature
from src.models import SentryInstallation, Item

from flask import jsonify, request, Response


@app.route("/api/sentry/options/items/", methods=["GET"])
@verify_sentry_signature()
def get_item_options() -> Response:
    uuid = request.args.get("installationId")
    sentry_installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not sentry_installation:
        return Response('', 404)
    items = Item.query.filter(Item.organization_id == sentry_installation.organization_id).all()
    result = [{"value": item.id, "label": item.title} for item in items]
    app.logger.info(f"Populating item options in Sentry")
    return jsonify(result)
