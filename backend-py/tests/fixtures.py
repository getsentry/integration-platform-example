from __future__ import annotations

import re

from src.models import Item, Organization, User


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
) -> Item:
    item = Item(
        title=title,
        description="computers",
        complexity=1,
        column="Todo",
        assignee_id=getattr(user, "id", None),
        organization_id=organization.id,
    )

    db_session.add(item)
    db_session.commit()

    return item
