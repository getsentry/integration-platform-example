from src.api.serializers import register
from src.models import Item
from src.types import JSONData


@register(Item)
class ItemSerializer:
    def serialize(self, obj) -> JSONData:
        return {
            "id": obj.id,
            "assigneeId": obj.assignee_id,
            "column": obj.column.value,
            "complexity": obj.complexity,
            "description": obj.description,
            "sentryId": obj.sentry_id,
            "sentryAlertId": obj.sentry_alert_id,
            "comments": obj.comments,
            "isIgnored": obj.is_ignored,
            "organizationId": obj.organization_id,
            "title": obj.title,
        }
