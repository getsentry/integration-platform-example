from __future__ import annotations

from flask import json
from werkzeug.exceptions import NotFound

from src import app
from src.models import Item


@app.route("/api/items/", methods=["GET"])
def items_index():
    return json.dumps([item for item in Item.query.all()])


@app.route("/api/items/<int:item_id>/", methods=["GET"])
def item_details(item_id: int):
    item = Item.query.filter(Item.id == item_id).first()

    if not item:
        raise NotFound

    return json.dumps(item)
