from __future__ import annotations

import re
from typing import Any, Mapping

from werkzeug.exceptions import BadRequest

from . import validate_optional_str, validate_str


def validate_slug(value: str | None) -> str:
    slug = re.sub(r'\s+', '-', (value or '').lower().strip())
    if not slug:
        raise BadRequest("Invalid: field 'slug' must not be empty")

    return validate_str(slug, 'slug')


def validate_new_organization(data: Mapping[str, Any]) -> Mapping[str, Any]:
    if not data:
        raise BadRequest('Invalid: POST data must not be empty')

    slug = validate_slug(data.get('slug'))
    external_slug = validate_optional_str(data.get('externalSlug'), 'externalSlug')
    name = validate_optional_str(data.get('name'), 'name')

    return dict(name=name, slug=slug, external_slug=external_slug)


def validate_organization_update(data: Mapping[str, Any]) -> Mapping[str, Any]:
    data = data or {}
    output = dict()

    if 'name' in data:
        output['name'] = validate_optional_str(data.get('name'), 'name')

    if 'externalSlug' in data:
        output['external_slug'] = validate_optional_str(data.get('externalSlug'), 'externalSlug')

    if not output:
        raise BadRequest('Invalid: PUT data must not be empty')

    return output
