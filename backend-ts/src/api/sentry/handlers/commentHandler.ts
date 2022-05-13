import {Response} from 'express';

import Item, {ItemComment} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';

async function handleCreated(item: Item, comment: ItemComment) {
  await item.update({comments: [...(item.comments ?? []), comment]});
  console.info(`Added new comment from Sentry issue`);
}

async function handleUpdated(item: Item, comment: ItemComment) {
  // Create a copy since Array.prototype.splice mutates the original array
  const comments = [...(item.comments ?? [])];
  const commentIndex = comments.findIndex(
    c => c.sentryCommentId === comment.sentryCommentId
  );
  comments.splice(commentIndex, 1, comment);
  await item.update({comments});
  console.info(`Updated comment from Sentry issue`);
}

async function handleDeleted(item: Item, comment: ItemComment) {
  await item.update({
    comments: (item.comments ?? []).filter(
      c => c.sentryCommentId !== comment.sentryCommentId
    ),
  });
  console.info(`Deleted comment from Sentry issue`);
}

export default async function commentHandler(
  response: Response,
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>,
  actor: Record<string, any>
): Promise<void> {
  const item = await Item.findOne({
    where: {
      sentryId: `${data.issue_id}`,
      organizationId: sentryInstallation.organizationId,
    },
  });
  if (!item) {
    console.info(`Ignoring comment for unlinked Sentry issue`);
    response.status(200);
    return;
  }
  // In your application you may want to map Sentry user IDs (actor.id) to your internal user IDs
  // for a richer comment sync experience
  const incomingComment: ItemComment = {
    text: data.comment,
    author: actor.name,
    timestamp: data.timestamp,
    sentryCommentId: data.comment_id,
  };

  switch (action) {
    case 'created':
      await handleCreated(item, incomingComment);
      response.status(201);
      break;
    case 'updated':
      await handleUpdated(item, incomingComment);
      response.status(200);
      break;
    case 'deleted':
      await handleDeleted(item, incomingComment);
      response.status(204);
      break;
    default:
      console.info(`Unexpected Sentry comment action: ${action}`);
      response.status(400);
  }
}
