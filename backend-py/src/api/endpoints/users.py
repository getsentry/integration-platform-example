from __future__ import annotations

from flask import jsonify, request, Response
from flask.views import MethodView
from werkzeug.exceptions import NotFound

from src.api.endpoints.base import register_api
from src.api.serializers import serialize
from src.api.validators import validate_new_user, validate_user_update
from src.database import db_session
from src.models import Organization, User


class UserAPI(MethodView):
    def _get_user_or_404(self, user_id: int) -> User:
        user = User.query.filter(User.id == user_id).first()
        if not user:
            raise NotFound
        return user

    def index(self) -> Response:
        organization_slug = request.args.get('organization')

        query = User.query

        if organization_slug is not None:
            organization_option = Organization.query.filter(
                Organization.slug == organization_slug
            ).first()
            if organization_option:
                query = query.filter(User.organization_id == organization_option.id)

        return jsonify(serialize(query.all()))

    def get(self, user_id: int) -> Response:
        if user_id is None:
            return self.index()

        user = self._get_user_or_404(user_id)
        return serialize(user)

    def post(self) -> Response:
        user = User(**validate_new_user(request.json))
        db_session.add(user)
        db_session.commit()

        response = jsonify(serialize(user))
        response.status_code = 201
        return response

    def put(self, user_id: int) -> Response:
        user = self._get_user_or_404(user_id)

        for key, value in validate_user_update(request.json).items():
            setattr(user, key, value)

        db_session.commit()
        response = jsonify(serialize(user))
        response.status_code = 204
        return response

    def delete(self, user_id: int) -> Response:
        user = self._get_user_or_404(user_id)

        db_session.delete(user)
        db_session.commit()

        return Response(status=204)


register_api(UserAPI, 'user_api', '/api/users/', pk='user_id')
