from __future__ import annotations

import abc
from typing import Any, Callable, MutableMapping, Sequence, Type, TypeVar

from src.database import Base
from src.types import JSONData


K = TypeVar('K')

registry: MutableMapping[Any, Any] = {}


def register(type: Any) -> Callable[[Type[K]], Type[K]]:
    """
    A wrapper that adds the wrapped Serializer to the Serializer registry (see
    above) for the key `type`.
    """

    def wrapped(cls: Type[K]) -> Type[K]:
        registry[type] = cls()
        return cls

    return wrapped


def serialize(objects: Base | Sequence[Base], **kwargs: Any) -> JSONData | Sequence[JSONData]:
    """
    Turn a model (or list of models) into a python object made entirely of primitives.

    :param objects: A list of objects
    :param kwargs Any
    :returns A list of the serialized versions of `objects`.
    """
    if not objects:
        return objects

    if not isinstance(objects, list):
        return registry[type(objects)].serialize(objects, **kwargs)

    serializer = registry[type(objects[0])]
    return [serializer.serialize(o, **kwargs) for o in objects]


class BaseSerializer(abc.ABC):
    """A Serializer class contains the logic to serialize a specific type of object."""

    @abc.abstractmethod
    def serialize(
        self, objects: Base | Sequence[Base], **kwargs: Any
    ) -> MutableMapping[str, JSONData]:
        pass
