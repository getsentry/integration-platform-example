import enum
from typing import Any, MutableMapping

JSONData = MutableMapping[str, Any]


class Column(enum.Enum):
    TODO = "TODO"
    DOING = "DOING"
    DONE = "DONE"
