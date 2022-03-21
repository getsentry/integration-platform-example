from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, String, DateTime

from .. import database


class SentryInstallation(database.Base):
    __tablename__ = "SentryInstallations"

    # TODO(mgaeta): HACK for tests until we migrate the table.
    # id = Column(Integer, primary_key=True)
    # uuid = Column(String)
    id = Column(String, primary_key=True)
    org_slug = Column(String)
    token = Column(String)
    refresh_token = Column(String)
    expires_at = Column(DateTime)

    def __init__(
        self,
        uuid: str,
        org_slug: str,
        token: str,
        refresh_token: str,
        expires_at: datetime | None = None,
    ):
        self.id = uuid
        self.org_slug = org_slug
        self.token = token
        self.refresh_token = refresh_token
        self.expires_at = expires_at

    def __repr__(self):
        return f"<SentryInstallation #{self.id}: {self.org_slug}>"
