import {Response} from 'express';

import Item, {ItemColumn} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';
import User from '../../../models/User.model';

async function handleAssigned(
  sentryInstallation: SentryInstallation,
  issueData: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id, organization_id: sentryInstallation.organizationId},
    defaults: {
      ...getItemDefaultsFromSentryIssue(sentryInstallation, issueData),
      column: ItemColumn.Doing,
    },
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked item from Sentry issue`);
  // Find or create a user to associate with the item
  // Note: The assignee in Sentry might be a team, which you could handle here as well
  const {type, email, name} = issueData.assignedTo;
  if (type === 'user') {
    const [user, isUserNew] = await User.findOrCreate({
      where: {username: email},
      defaults: {
        name,
        username: email,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        organizationId: sentryInstallation.organizationId,
      },
    });
    await user.$add('items', item);
    console.info(`Assigned to ${isUserNew ? 'new' : 'existing'} user:`, user.username);
  }
}

async function handleCreated(
  sentryInstallation: SentryInstallation,
  issueData: Record<string, any>
) {
  // Create an item to associate with the Sentry Issue
  await Item.create(getItemDefaultsFromSentryIssue(sentryInstallation, issueData));
  console.info('Created linked item from Sentry issue');
}

async function handleIgnored(
  sentryInstallation: SentryInstallation,
  issueData: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id, organization_id: sentryInstallation.organizationId},
    defaults: getItemDefaultsFromSentryIssue(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked item from Sentry issue`);
  // Mark the item as ignored
  item.isIgnored = true;
  await item.save();
  console.info('Marked item as ignored');
}

async function handleResolved(
  sentryInstallation: SentryInstallation,
  issueData: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id, organization_id: sentryInstallation.organizationId},
    defaults: getItemDefaultsFromSentryIssue(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked item from Sentry Issue`);
  // Update the item's column to DONE
  item.column = ItemColumn.Done;
  await item.save();
  console.info(`Updated item's column to '${ItemColumn.Done}'`);
}

export default async function issueHandler(
  response: Response,
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
): Promise<void> {
  const {issue: issueData} = data;

  switch (action) {
    case 'assigned':
      await handleAssigned(sentryInstallation, issueData);
      response.status(202);
      break;
    case 'created':
      await handleCreated(sentryInstallation, issueData);
      response.status(201);
      break;
    case 'ignored':
      await handleIgnored(sentryInstallation, issueData);
      response.status(202);
      break;
    case 'resolved':
      await handleResolved(sentryInstallation, issueData);
      response.status(202);
      break;
    default:
      console.info(`Unhandled Sentry Issue action: ${action}`);
      response.status(400);
  }
}

export const getItemDefaultsFromSentryIssue = (
  sentryInstallation: SentryInstallation,
  issueData: Record<string, any>
) => ({
  organizationId: sentryInstallation.organizationId,
  title: issueData.title as string,
  description: `${issueData.shortId} - ${issueData.culprit}`,
  column: issueData.status === 'resolved' ? ItemColumn.Done : ItemColumn.Todo,
  isIgnored: issueData.status === 'ignored',
  sentryId: issueData.id,
});
