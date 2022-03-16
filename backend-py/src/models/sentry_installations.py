from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from .. import database


class SentryInstallation(database.Base):
    __tablename__ = "SentryInstallations"

    id = Column(Integer, primary_key=True)
    orgSlug = Column(String)
    token = Column(String)
    refreshToken = Column(String)
    expiresAt = Column(DateTime)

    def __init__(
        self,
        orgSlug: str | None = None,
        token: str | None = None,
        refreshToken: str | None = None,
        expiresAt: datetime | None = None,
    ):
        self.orgSlug = orgSlug
        self.token = token
        self.refreshToken = refreshToken
        self.expiresAt = expiresAt

    def __repr__(self):
        return f"<SentryInstallation #{self.id}: {self.orgSlug}>"
