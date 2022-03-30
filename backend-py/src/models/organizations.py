from __future__ import annotations

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from .. import database


class Organization(database.Base):
    __tablename__ = "organization"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    external_slug = Column(String, nullable=False)

    items = relationship("Item")
    users = relationship("User")
    sentry_installations = relationship("SentryInstallation")

    def __init__(self, name: str, slug: str, external_slug: str) -> None:
        self.name = name
        self.slug = slug
        self.external_slug = external_slug

    def __repr__(self) -> str:
        return f"<Organization #{self.id}: {self.slug}>"
