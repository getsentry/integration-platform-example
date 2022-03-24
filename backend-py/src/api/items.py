from __future__ import annotations

from flask import json, request
from flask.views import MethodView
from werkzeug.exceptions import NotFound

from src.database import db_session
from src.models import Item, Organization
from src.api.base import register_api


class ItemAPI(MethodView):
    def _get_item_or_404(self, item_id: int) -> Item:
        item = Item.query.filter(Item.id == item_id).first()
        if not item:
            raise NotFound
        return item

    def index(self):
        organization_slug = request.args.get("organization")
        user_id = request.args.get("user")

        query = Item.query

        if organization_slug is not None:
            organization_option = Organization.query.filter(
                Organization.slug == organization_slug
            ).first()
            if organization_option:
                query = query.filter(Item.organization_id == organization_option.slug)

        if user_id is not None:
            query = query.filter(Item.user_id == user_id)

        return json.dumps([item for item in query.all()])

    def get(self, item_id: int):
        if item_id is None:
            return self.index()

        item = self._get_item_or_404(item_id)
        return json.dumps(item)

    def post(self):
        # Get the JSON parameters.
        title = request.json.get("title")
        description = request.json.get("description")
        complexity = request.json.get("complexity")
        column = request.json.get("column")
        assignee_id = request.json.get("assignee_id")
        organization_id = request.json.get("organization_id")

        item = Item(
            title=title,
            description=description,
            complexity=complexity,
            column=column,
            assignee_id=assignee_id,
            organization_id=organization_id,
        )
        db_session.add(item)
        db_session.commit()

        return json.dumps(item), 201

    def delete(self, item_id: int):
        item = self._get_item_or_404(item_id)

        db_session.delete(item)
        db_session.commit()
        return "", 204

    def put(self, item_id: int):
        item = self._get_item_or_404(item_id)

        title = request.json.get("title")
        description = request.json.get("description")
        complexity = request.json.get("complexity")
        column = request.json.get("column")

        if title is not None:
            item.title = title

        if description is not None:
            item.description = description

        if complexity is not None:
            item.complexity = complexity

        if column is not None:
            item.column = column

        db_session.commit()
        return json.dumps(item)


register_api(ItemAPI, "item_api", "/api/items/", pk="item_id")
