from src.api.serializers import register
from src.models import User
from src.types import JSONData


@register(User)
class UserSerializer:
    def serialize(self, obj) -> JSONData:
        return {
            "id": obj.id,
            "name": obj.name,
            "username": obj.username,
            "avatar": obj.avatar,
            "organizationId": obj.organization_id,
            "createdAt": obj.created_at,
            "updatedAt": obj.updated_at,
        }
