from __future__ import annotations

from sqlalchemy import Column, DateTime, Integer, String, ForeignKey

from .. import database


class Item(database.Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    complexity = Column(Integer)
    column = Column(String, nullable=False)
    assignee_id = Column(Integer, ForeignKey('user.id'))
    organization_id = Column(Integer, ForeignKey('organization.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def __init__(
        self,
        title: str | None = None,
        description: str | None = None,
        complexity: int | None = None,
        column: str | None = None,
    ):
        self.title = title
        self.description = description
        self.complexity = complexity
        self.column = column

    def __repr__(self):
        return f"<Item #{self.id}: {self.title}>"
