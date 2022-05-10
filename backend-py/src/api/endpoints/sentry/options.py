from __future__ import annotations


from src import app
from src.api.middleware import verify_sentry_signature
from src.models import SentryInstallation, Item, User

from flask import jsonify, request, Response


# These endpoints are used to populate the options for 'Select' FormFields in Sentry.

@app.route("/api/sentry/options/items/", methods=["GET"])
@verify_sentry_signature()
def get_item_options() -> Response:
    uuid = request.args.get("installationId")
    sentry_installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not sentry_installation:
        return Response('', 404)
    # We can use the installation data to filter the items we return to Sentry.
    items = Item.query.filter(Item.organization_id == sentry_installation.organization_id).all()
    # Sentry requires the results in this exact format.
    result = [{"value": item.id, "label": item.title} for item in items]
    app.logger.info("Populating item options in Sentry")
    return jsonify(result)


@app.route("/api/sentry/options/users/", methods=["GET"])
@verify_sentry_signature()
def get_user_options() -> Response:
    uuid = request.args.get("installationId")
    sentry_installation = SentryInstallation.query.filter(
        SentryInstallation.uuid == uuid
    ).first()
    if not sentry_installation:
        return Response('', 404)
    # We can use the installation data to filter the users we return to Sentry.
    users = User.query.filter(User.organization_id == sentry_installation.organization_id).all()
    # Sentry requires the results in this exact format.
    result = [{"value": user.id, "label": user.name} for user in users]
    app.logger.info("Populating user options in Sentry")
    return jsonify(result)
