from __future__ import annotations

from sqlalchemy import Column,  Integer, String, ForeignKey, Boolean, Enum

from .. import database
from ..types import ItemColumn


class Item(database.Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    complexity = Column(Integer)
    column = Column(
        Enum(ItemColumn, values_callable=lambda x: [e.value for e in x]),
        default=ItemColumn.Todo,
        nullable=False,
    )
    is_ignored = Column(Boolean, default=False)
    sentry_id = Column(String)
    sentry_alert_id = Column(String)
    assignee_id = Column(Integer, ForeignKey('user.id'))
    organization_id = Column(Integer, ForeignKey('organization.id'))

    def __init__(
        self,
        title: str,
        organization_id: int,
        assignee_id: int | None = None,
        description: str | None = None,
        complexity: int | None = None,
        column: str | None = None,
        sentry_id: str | None = None,
        sentry_alert_id: str | None = None,
        is_ignored: bool | None = False,
    ):
        self.title = title
        self.description = description
        self.complexity = complexity
        self.column = column
        self.organization_id = organization_id
        self.assignee_id = assignee_id
        self.sentry_id = sentry_id
        self.sentry_alert_id = sentry_alert_id
        self.is_ignored = is_ignored

    def __repr__(self):
        return f"<Item #{self.id}: {self.title}>"
