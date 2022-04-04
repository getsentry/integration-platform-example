import enum
from typing import Any, MutableMapping

JSONData = MutableMapping[str, Any]


class ItemColumn(enum.Enum):
    Todo = "TODO"
    Doing = "DOING"
    Done = "DONE"
