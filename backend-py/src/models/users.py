from __future__ import annotations

from sqlalchemy import Column, DateTime, Integer, ForeignKey, String
from .. import database


class User(database.Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    username = Column(String)
    avatar = Column(Integer)
    organization_id = Column(Integer, ForeignKey('organization.id'))

    def __init__(
        self,
        name: str | None = None,
        username: str | None = None,
        avatar: str | None = None,
    ):
        self.name = name
        self.username = username
        self.avatar = avatar

    def __repr__(self):
        return f"<User #{self.id}: {self.username}>"
