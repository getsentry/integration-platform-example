from src.api.serializers import register
from src.models import Item
from src.types import JSONData


@register(Item)
class ItemSerializer:
    def serialize(self, obj) -> JSONData:
        return {
            "id": obj.id,
            "assignee_id": obj.assignee_id,
            "column": obj.column,
            "complexity": obj.complexity,
            "created_at": obj.created_at,
            "description": obj.description,
            "organization_id": obj.organization_id,
            "title": obj.title,
            "updated_at": obj.updated_at,
        }
