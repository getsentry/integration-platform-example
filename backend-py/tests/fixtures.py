from __future__ import annotations
from datetime import datetime

import re

from src.models import Item, Organization, User, SentryInstallation
from src.types import ItemColumn
from .mocks import INSTALLATION, MOCK_SETUP


def create_user(
    db_session,
    organization: Organization,
    name: str = "Test User",
) -> Organization:
    user = User(
        name=name,
        username=name.lower().replace(" ", ""),
        organization_id=organization.id,
    )
    db_session.add(user)
    db_session.commit()

    return user


def create_organization(
    db_session,
    name: str = "Organization",
) -> Organization:
    slug = re.sub(r"\s+", "-", name.lower().strip())

    organization = Organization(
        name=name,
        slug=slug,
        external_slug=slug,
    )
    db_session.add(organization)
    db_session.commit()

    return organization


def create_item(
    db_session,
    organization: Organization,
    user: User | None = None,
    title: str = "Item Title",
    **item_kwargs,
) -> Item:
    item = Item(
        title=title,
        description="computers",
        complexity=1,
        column=ItemColumn.Todo,
        assignee_id=getattr(user, "id", None),
        organization_id=organization.id,
        **item_kwargs,
    )

    db_session.add(item)
    db_session.commit()

    return item


def create_sentry_installation(
    db_session,
    organization: Organization,
) -> SentryInstallation:
    sentry_installation = SentryInstallation(
        uuid=INSTALLATION["uuid"],
        org_slug=INSTALLATION["organization"]["slug"],
        token=MOCK_SETUP["newToken"]["token"],
        refresh_token=MOCK_SETUP["newToken"]["refreshToken"],
        expires_at=datetime.strptime(MOCK_SETUP["newToken"]["expiresAt"], "%Y-%m-%dT%H:%M:%S.%fZ"),
        organization_id=organization.id,
    )

    db_session.add(sentry_installation)
    db_session.commit()

    return sentry_installation
