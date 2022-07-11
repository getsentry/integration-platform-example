from __future__ import annotations

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from .. import database


class User(database.Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    username = Column(String, nullable=False)
    avatar = Column(String)
    organization_id = Column(Integer, ForeignKey('organization.id'))

    items = relationship("Item")

    def __init__(
        self,
        username: str,
        organization_id: int,
        name: str | None = None,
        avatar: str | None = None,
    ):
        self.name = name
        self.username = username
        self.avatar = avatar
        self.organization_id = organization_id

    def __repr__(self):
        return f"<User #{self.id}: {self.username}>"
