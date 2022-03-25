from src.api.serializers import register
from src.models import Item
from src.types import JSONData


@register(Item)
class ItemSerializer:
    def serialize(self, obj) -> JSONData:
        return {
            "id": obj.id,
            "assigneeId": obj.assignee_id,
            "column": obj.column,
            "complexity": obj.complexity,
            "createdAt": obj.created_at,
            "description": obj.description,
            "organizationId": obj.organization_id,
            "title": obj.title,
            "updatedAt": obj.updated_at,
        }
