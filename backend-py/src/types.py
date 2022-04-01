import enum
from typing import Any, MutableMapping

JSONData = MutableMapping[str, Any]


class ItemColumn(enum.Enum):
    TODO = "TODO"
    DOING = "DOING"
    DONE = "DONE"
