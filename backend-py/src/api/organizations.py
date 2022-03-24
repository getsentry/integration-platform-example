from __future__ import annotations

from flask import json, request
from flask.views import MethodView
from werkzeug.exceptions import NotFound

from src.database import db_session
from src.models import Organization
from src.api.base import register_api


class OrganizationAPI(MethodView):
    def _get_organization_or_404(self, organization_slug: str) -> Organization:
        organization = Organization.query.filter(Organization.slug == organization_slug).first()
        if not organization:
            raise NotFound
        return organization

    def index(self):
        return json.dumps([organization for organization in Organization.query.all()])

    def get(self, organization_slug: str):
        if organization_slug is None:
            return self.index()

        organization = self._get_organization_or_404(organization_slug)
        return json.dumps(organization)

    def post(self):
        # Get the JSON parameters.
        name = request.json.get("name")
        slug = request.json.get("slug")
        external_slug = request.json.get("external_slug")

        organization = Organization(
            name=name,
            slug=slug,
            external_slug=external_slug,
        )
        db_session.add(organization)
        db_session.commit()

        return json.dumps(organization), 201

    def delete(self, organization_slug: str):
        organization = self._get_organization_or_404(organization_slug)

        # TODO(mgaeta): Cascade deletions.

        db_session.delete(organization)
        db_session.commit()
        return "", 204

    def put(self, organization_slug: str):
        organization = self._get_organization_or_404(organization_slug)

        name = request.json.get("name")
        external_slug = request.json.get("external_slug")

        if name is not None:
            organization.name = name

        if external_slug is not None:
            organization.external_slug = external_slug

        db_session.commit()
        return json.dumps(organization)


register_api(
    OrganizationAPI,
    "organization_api",
    "/api/organizations/",
    pk="organization_slug",
    pk_type=str,
)

