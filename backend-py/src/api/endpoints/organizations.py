from __future__ import annotations

from flask import jsonify, request, Response
from flask.views import MethodView
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest, NotFound

from src.api.endpoints.base import register_api
from src.api.serializers import serialize
from src.api.validators import validate_new_organization, validate_organization_update
from src.database import db_session
from src.models import Organization, Organization


class OrganizationAPI(MethodView):
    def _get_organization_or_404(self, organization_slug: str) -> Organization:
        organization = Organization.query.filter(Organization.slug == organization_slug).first()
        if not organization:
            raise NotFound
        return organization

    def index(self) -> Response:
        return jsonify(serialize(Organization.query.all()))

    def get(self, organization_slug: str) -> Response:
        if organization_slug is None:
            return self.index()

        organization = self._get_organization_or_404(organization_slug)
        return serialize(organization)

    def post(self) -> Response:
        organization = Organization(**validate_new_organization(request.json))
        db_session.add(organization)

        try:
            db_session.commit()
        except IntegrityError:
            raise BadRequest(f"Invalid: property 'slug' must be unique")

        response = jsonify(serialize(organization))
        response.status_code = 201
        return response

    def put(self, organization_slug: str) -> Response:
        organization = self._get_organization_or_404(organization_slug)

        for key, value in validate_organization_update(request.json).items():
            setattr(organization, key, value)

        db_session.commit()
        response = jsonify(serialize(organization))
        response.status_code = 204
        return response

    def delete(self, organization_slug: str) -> Response:
        organization = self._get_organization_or_404(organization_slug)

        db_session.delete(organization)
        db_session.commit()

        return Response(status=204)


register_api(
    OrganizationAPI,
    "organization_api",
    "/api/organizations/",
    pk="organization_slug",
    pk_type="string",
)
