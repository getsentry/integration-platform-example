from src.api.serializers import register
from src.models import Organization
from src.types import JSONData


@register(Organization)
class OrganizationSerializer:
    def serialize(self, obj) -> JSONData:
        return {
            'id': obj.id,
            'name': obj.name,
            'slug': obj.slug,
            'externalSlug': obj.slug,
        }
