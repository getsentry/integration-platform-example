from typing import Any, Mapping
from flask import Response

from src import app
from src.models import Item, SentryInstallation
from src.models.item import ItemComment
from src.database import db_session


def handle_created(item: Item, comment: ItemComment) -> Response:
    item.comments = (item.comments or []) + [comment]
    db_session.commit()
    app.logger.info('Added new comment from Sentry issue')
    return Response('', 201)


def handle_updated(item: Item, comment: ItemComment) -> Response:
    item.comments = [
        comment
        if existing_comment['sentryCommentId'] == comment['sentryCommentId']
        else existing_comment
        for existing_comment in item.comments or []
    ]
    db_session.commit()
    app.logger.info('Updated comment from Sentry issue')
    return Response('', 200)


def handle_deleted(item: Item, comment: ItemComment) -> Response:
    item.comments = list(filter(
        lambda existing_comment: existing_comment['sentryCommentId'] !=
        comment['sentryCommentId'], item.comments or []))
    db_session.commit()
    app.logger.info('Deleted comment from Sentry issue')
    return Response('', 204)


def comment_handler(
    action: str,
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any],
    actor: Mapping[str, Any],
) -> Response:
    item = Item.query.filter(
        Item.sentry_id == str(data['issue_id']),
        Item.organization_id == sentry_installation.organization_id
    ).first()
    if item is None:
        app.logger.info('Ignoring comment for unlinked Sentry issue')
        return Response('', 200)

    # In your application you may want to map Sentry user IDs (actor.id) to your internal user IDs
    # for a richer comment sync experience
    incoming_comment = {
        'text': data['comment'],
        'author': actor['name'],
        'timestamp': data['timestamp'],
        'sentryCommentId': data['comment_id'],
    }

    if action == 'created':
        return handle_created(item, incoming_comment)
    elif action == 'updated':
        return handle_updated(item, incoming_comment)
    elif action == 'deleted':
        return handle_deleted(item, incoming_comment)
    else:
        app.logger.info(f'Unexpected Sentry comment action: {action}')
        return Response('', 400)
