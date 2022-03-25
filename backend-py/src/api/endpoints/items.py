from __future__ import annotations

from flask import jsonify, request, Response
from flask.views import MethodView
from werkzeug.exceptions import NotFound

from src.api.endpoints.base import register_api
from src.api.serializers import serialize
from src.api.validators import validate_new_item, validate_item_update
from src.database import db_session
from src.models import Item, Organization


class ItemAPI(MethodView):
    def _get_item_or_404(self, item_id: int) -> Item:
        item = Item.query.filter(Item.id == item_id).first()
        if not item:
            raise NotFound
        return item

    def index(self) -> Response:
        organization_slug = request.args.get("organization")
        user_id = request.args.get("user")

        query = Item.query

        if organization_slug is not None:
            organization_option = Organization.query.filter(
                Organization.slug == organization_slug
            ).first()
            if organization_option:
                query = query.filter(Item.organization_id == organization_option.id)

        if user_id is not None:
            query = query.filter(Item.assignee_id == user_id)

        return jsonify(serialize(query.all()))

    def get(self, item_id: int) -> Response:
        if item_id is None:
            return self.index()

        item = self._get_item_or_404(item_id)
        return serialize(item)

    def post(self) -> Response:
        item = Item(**validate_new_item(request.json))
        db_session.add(item)
        db_session.commit()

        response = jsonify(serialize(item))
        response.status_code = 201
        return response

    def put(self, item_id: int) -> Response:
        item = self._get_item_or_404(item_id)

        for key, value in validate_item_update(request.json).items():
            setattr(item, key, value)

        db_session.commit()
        response = jsonify(serialize(item))
        response.status_code = 204
        return response

    def delete(self, item_id: int) -> Response:
        item = self._get_item_or_404(item_id)

        db_session.delete(item)
        db_session.commit()

        return Response(status=204)


register_api(ItemAPI, "item_api", "/api/items/", pk="item_id")
