from typing import Any, Mapping

from src import app
from src.models import Item, SentryInstallation, User
from src.models.items import ItemColumn
from src.database import db_session

from flask import Response


def handle_assigned(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    # Find or create an item to associate with the Sentry Issue
    item, item_created = get_or_create_item(sentry_installation, issue_data)
    app.logger.info(f"{'Created' if item_created else 'Found'} linked Sentry issue")
    # Find or create a user to associate with the item
    # Note: The assignee in Sentry might be a team, which you could handle here as well
    assignee_data = issue_data.get('assignedTo', {})
    if assignee_data.get('type') == 'user':
        user, user_created = get_or_create_user(sentry_installation, assignee_data)
        item.assignee_id = user.id
        app.logger.info(
            f"Assigned to {'new' if user_created else 'existing'} user: {user.username}")
    db_session.commit()


def handle_created(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    # Create an item to associate with the Sentry Issue
    item = Item(**get_item_defaults(sentry_installation, issue_data))
    db_session.add(item)
    db_session.commit()
    app.logger.info("Created linked Sentry issue")


def handle_ignored(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    # Find or create an item to associate with the Sentry Issue
    item, item_created = get_or_create_item(sentry_installation, issue_data)
    app.logger.info(f"{'Created' if item_created else 'Found'} linked Sentry issue")
    # Mark the item as ignored
    item.is_ignored = True
    db_session.commit()
    app.logger.info("Marked item as ignored")


def handle_resolved(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    # Find or create an item to associate with the Sentry Issue
    item, item_created = get_or_create_item(sentry_installation, issue_data)
    app.logger.info(f"{'Created' if item_created else 'Found'} linked Sentry issue")
    # Update the item's column to DONE
    item.column = ItemColumn.Done.value
    db_session.commit()
    app.logger.info(f"Updated item's column to {ItemColumn.Done.value}")


def issue_handler(action: str, sentry_installation: SentryInstallation, data: Mapping[str, Any]) -> Response:
    issue_data = data.get('issue')
    if action == "assigned":
        handle_assigned(sentry_installation, issue_data)
        return Response('', 202)
    elif action == "created":
        handle_created(sentry_installation, issue_data)
        return Response('', 201)
    elif action == "ignored":
        handle_ignored(sentry_installation, issue_data)
        return Response('', 202)
    elif action == 'resolved':
        handle_resolved(sentry_installation, issue_data)
        return Response('', 200)
    else:
        app.logger.info(f"Unhandled Sentry Issue action: {action}")
        return Response('', 400)


def get_item_defaults(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    return {
        "organization_id": sentry_installation.organization_id,
        "title": issue_data.get('title'),
        "description": f"{issue_data.get('shortId')} - {issue_data.get('culprit')}",
        "column": ItemColumn.Done.value if issue_data.get('status') == "resolved" else ItemColumn.Todo.value,
        "is_ignored": issue_data.get('status') == "ignored",
        "sentry_id": issue_data.get('id'),
    }


def get_or_create_item(sentry_installation: SentryInstallation, issue_data: Mapping[str, Any]):
    item = Item.query.filter(
        Item.sentry_id == issue_data.get('id'),
        Item.organization_id == sentry_installation.organization_id
    ).first()
    if item:
        return item, False
    else:
        item = Item(**get_item_defaults(sentry_installation, issue_data))
        db_session.add(item)
        db_session.commit()
        return item, True


def get_or_create_user(sentry_installation: SentryInstallation, assignee_data: Mapping[str, Any]):
    user = User.query.filter(
        User.username == assignee_data.get('email'),
    ).first()
    if user:
        return user, False
    else:
        user = User(
            name=assignee_data.get('name'),
            username=assignee_data.get('email'),
            organization_id=sentry_installation.organization_id,
            avatar=f"https://ui-avatars.com/api/?name={assignee_data.get('name')}&background=random"
        )
        db_session.add(user)
        db_session.commit()
        return user, True
