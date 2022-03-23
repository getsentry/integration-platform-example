from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime

from .. import database


class SentryInstallation(database.Base):
    __tablename__ = "sentry_installation"

    id = Column(Integer, primary_key=True)
    uuid = Column(String, nullable=False)
    org_slug = Column(String, nullable=False)
    token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    organization_id = Column(Integer, ForeignKey('organization.id'))
    expires_at = Column(DateTime)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def __init__(
        self,
        uuid: str,
        org_slug: str,
        token: str,
        refresh_token: str,
        expires_at: datetime | None = None,
    ):
        self.uuid = uuid
        self.org_slug = org_slug
        self.token = token
        self.refresh_token = refresh_token
        self.expires_at = expires_at

    def __repr__(self):
        return f"<SentryInstallation #{self.id}: {self.org_slug}>"
