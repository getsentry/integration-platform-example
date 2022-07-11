import enum
from typing import Any, MutableMapping, TypedDict

JSONData = MutableMapping[str, Any]


class ItemComment(TypedDict):
    text: str
    author: str
    timestamp: str
    sentryCommentId: str


class ItemColumn(enum.Enum):
    Todo = 'TODO'
    Doing = 'DOING'
    Done = 'DONE'
