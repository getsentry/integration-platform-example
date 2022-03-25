from __future__ import annotations

from typing import Any, Mapping

from werkzeug.exceptions import BadRequest

from src.types import Column

from . import (
    validate_optional_id,
    validate_optional_integer,
    validate_optional_str,
    validate_organization,
)


COMPLEXITY_MAX = 9000
COMPLEXITY_MIN = 0


def validate_assignee(value: int | str | None) -> int | None:
    return validate_optional_id(value, "assigneeId")


def validate_column(value: str | None) -> str:
    if value is None:
        return Column.TODO.value

    try:
        return Column(value.upper()).value
    except ValueError:
        raise BadRequest(f"Invalid: field 'column' must be one of {[e.value for e in Column]}")


def validate_complexity(value: int | str | None) -> int:
    return (
        validate_optional_integer(value, "complexity", COMPLEXITY_MIN, COMPLEXITY_MAX)
        or COMPLEXITY_MIN
    )


def validate_new_item(data: Mapping[str, Any]) -> Mapping[str, Any]:
    if not data:
        raise BadRequest(f"Invalid: POST data must not be empty")

    assignee_id = validate_assignee(data.get("assigneeId"))
    column = validate_column(data.get("column"))
    complexity = validate_complexity(data.get("complexity"))
    organization_id = validate_organization(data.get("organizationId"))

    title = validate_optional_str(data.get("title"), "title")
    description = validate_optional_str(data.get("description"), "description")

    return dict(
        assignee_id=assignee_id,
        column=column,
        complexity=complexity,
        description=description,
        organization_id=organization_id,
        title=title,
    )


def validate_item_update(data: Mapping[str, Any]) -> Mapping[str, Any]:
    data = data or {}
    output = dict()

    if "assigneeId" in data:
        output["assignee_id"] = validate_assignee(data.get("assigneeId"))

    if "column" in data:
        output["column"] = validate_column(data.get("column"))

    if "complexity" in data:
        output["complexity"] = validate_complexity(data.get("complexity"))

    if "title" in data:
        output["title"] = validate_optional_str(data.get("title"), "title")

    if "description" in data:
        output["description"] = validate_optional_str(data.get("description"), "description")

    if not output:
        raise BadRequest(f"Invalid: PUT data must not be empty")

    return output
