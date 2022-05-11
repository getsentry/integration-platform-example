import {Response} from 'express';

import Item, {ItemComment} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';

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
    console.info(`Ignoring comment for unlinked Sentry issue.`);
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
  const commentIndex = item.comments.findIndex(
    comment => comment.sentryCommentId === incomingComment.sentryCommentId
  );
  switch (action) {
    case 'created':
    case 'updated':
      if (commentIndex === -1) {
        await item.update({comments: [...(item.comments ?? []), incomingComment]});
        console.info(`Added new comment from Sentry issue`);
      } else {
        const comments = [...item.comments];
        comments.splice(commentIndex, 1, incomingComment);
        await item.update({comments});
        console.info(`Updated comment from Sentry issue`);
      }
      break;
    case 'deleted':
      await item.update({
        comments: item.comments.filter(
          comment => comment.sentryCommentId !== incomingComment.sentryCommentId
        ),
      });
      console.info(`Deleted comment from Sentry issue`);
      break;
    default:
      console.info(`Unexpected Sentry comment action: ${action}`);
      response.status(400);
  }
}
