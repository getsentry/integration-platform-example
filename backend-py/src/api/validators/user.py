from __future__ import annotations

from typing import Any, Mapping

from werkzeug.exceptions import BadRequest

from . import validate_optional_str, validate_organization


def validate_new_user(data: Mapping[str, Any]) -> Mapping[str, Any]:
    if not data:
        raise BadRequest("Invalid: POST data must not be empty")

    name = validate_optional_str(data.get("name"), "name")
    username = validate_optional_str(data.get("name"), "username")
    avatar = validate_optional_str(data.get("name"), "avatar")
    organization_id = validate_organization(data.get("organizationId"))

    return dict(
        name=name,
        username=username,
        avatar=avatar,
        organization_id=organization_id,
    )


def validate_user_update(data: Mapping[str, Any]) -> Mapping[str, Any]:
    data = data or {}
    output = dict()

    if "name" in data:
        output["name"] = validate_optional_str(data.get("name"), "name")

    if "username" in data:
        output["username"] = validate_optional_str(data.get("username"), "username")

    if "avatar" in data:
        output["avatar"] = validate_optional_str(data.get("description"), "avatar")

    if not output:
        raise BadRequest("Invalid: PUT data must not be empty")

    return output
