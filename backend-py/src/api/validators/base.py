from __future__ import annotations

from werkzeug.exceptions import BadRequest

STR_LENGTH_MAX = 256
STR_LENGTH_MIN = 0


def validate_id(value: int | str, name: str) -> int:
    try:
        id_value = int(value)
    except (TypeError, ValueError):
        raise BadRequest(f"Invalid: ID field '{name}' must be an integer")

    if id_value <= 0:
        raise BadRequest(f"Invalid: ID field '{name}' must be a positive integer")

    return id_value


def validate_integer(
    value: int | str | None,
    name: str,
    minimum: int | None = None,
    maximum: int | None = None
) -> int:
    try:
        int_value = int(value)
    except ValueError:
        raise BadRequest(f"Invalid: field '{name}' must be an integer")

    if not (minimum <= int_value <= maximum):
        raise BadRequest(
            f"Invalid: field '{name}' must be between {minimum} and {maximum}"
        )
    return int_value


def validate_str(value: str, name: str) -> str:
    if not (STR_LENGTH_MIN <= len(value) <= STR_LENGTH_MAX):
        raise BadRequest(
            f"Invalid: field '{name}' must be between {STR_LENGTH_MIN} and"
            f' {STR_LENGTH_MAX} characters'
        )
    return value


def validate_optional_id(value: int | str | None, name: str) -> int | None:
    if value is None:
        return None

    return validate_id(value, name)


def validate_optional_integer(
    value: int | str | None,
    name: str,
    minimum: int | None = None,
    maximum: int | None = None
) -> int | None:
    if value is None:
        return None

    return validate_integer(value, name, minimum, maximum)


def validate_optional_str(value: str | None, name: str) -> str | None:
    if value is None:
        return None

    return validate_str(value, name)


def validate_organization(value: int | str | None) -> int:
    return validate_id(value, 'organizationId')
