from typing import Any, Mapping
from flask import Response

from src import app
from src.models import Item, SentryInstallation
from src.database import db_session


def comment_handler(
    action: str,
    sentry_installation: SentryInstallation,
    data: Mapping[str, Any],
    actor: Mapping[str, Any],
) -> Response:
    item = Item.query.filter(
        Item.sentry_id == str(data["issue_id"]),
        Item.organization_id == sentry_installation.organization_id
    ).first()
    if item is None:
        app.logger.info("Ignoring comment for unlinked Sentry issue")
        return Response('', 200)

    # In your application you may want to map Sentry user IDs (actor.id) to your internal user IDs
    # for a richer comment sync experience
    incoming_comment = {
        "text": data["comment"],
        "author": actor["name"],
        "timestamp": data["timestamp"],
        "sentryCommentId": data["comment_id"],
    }
    existing_comments = item.comments or []
    has_incoming_comment = any(
        comment["sentryCommentId"] == incoming_comment["sentryCommentId"]
        for comment in existing_comments
    )

    if action == 'created' or action == 'updated':
        if not has_incoming_comment:
            # Create a new comment at the end of the list
            item.comments = existing_comments + [incoming_comment]
            db_session.commit()
            app.logger.info("Added new comment from Sentry issue")
            return Response('', 201)
        else:
            # Replace the existing comment with an updated version
            item.comments = [
                incoming_comment
                if comment["sentryCommentId"] == incoming_comment["sentryCommentId"]
                else comment
                for comment in existing_comments
            ]
            db_session.commit()
            app.logger.info("Updated comment from Sentry issue")
            return Response('', 200)

    elif action == 'deleted':
        # Remove the matching comment from the list
        item.comments = list(filter(
            lambda comment: comment["sentryCommentId"] !=
            incoming_comment["sentryCommentId"], existing_comments))
        db_session.commit()
        app.logger.info("Deleted comment from Sentry issue")
        return Response('', 204)
    else:
        app.logger.info(f"Unexpected Sentry comment action: {action}")
        return Response('', 400)
