from __future__ import annotations

from flask import json
from werkzeug.exceptions import NotFound

from src import app
from src.models import Organization


@app.route("/api/organizations/", methods=["GET"])
def organization_index():
    return json.dumps([item for item in Organization.query.all()])


@app.route("/api/organizations/<string:organization_slug>/", methods=["GET"])
def organization_details(organization_slug: str):
    organization = Organization.query.filter(Organization.slug == organization_slug).first()

    if not organization:
        raise NotFound

    return json.dumps(organization)
