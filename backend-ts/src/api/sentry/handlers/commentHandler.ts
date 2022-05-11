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
  const existingComments = (item.comments ?? []) as ItemComment[];
  const commentIndex = existingComments.findIndex(
    comment => comment.sentryCommentId === incomingComment.sentryCommentId
  );
  switch (action) {
    case 'created':
    case 'updated':
      if (commentIndex === -1) {
        await item.update({comments: [...existingComments, incomingComment]});
        console.info(`Added new comment from Sentry issue`);
        response.status(201);
      } else {
        const comments = [...existingComments];
        comments.splice(commentIndex, 1, incomingComment);
        await item.update({comments});
        console.info(`Updated comment from Sentry issue`);
        response.status(200);
      }
      break;
    case 'deleted':
      await item.update({
        comments: existingComments.filter(
          comment => comment.sentryCommentId !== incomingComment.sentryCommentId
        ),
      });
      console.info(`Deleted comment from Sentry issue`);
      response.status(204);
      break;
    default:
      console.info(`Unexpected Sentry comment action: ${action}`);
      response.status(400);
  }
}
