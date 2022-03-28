import Item, {ItemColumn} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';
import User from '../../../models/User.model';

export async function handleResolved(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const {issue: issueData} = data;
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id},
    defaults: getItemDefaults(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked Sentry Issue`);
  // Update the item's column to Done
  item.column = ItemColumn.Done;
  await item.save();
  console.info(`Updated item's column to '${ItemColumn.Done}'`);
}

export async function handleAssigned(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const {issue: issueData} = data;
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id},
    defaults: getItemDefaults(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked Sentry issue`);
  // Find or create a user to associate with the item
  const {email, name} = issueData.assignedTo;
  const [user, isUserNew] = await User.findOrCreate({
    where: {username: email},
    defaults: {name, username: email, organizationId: sentryInstallation.organizationId},
  });
  await user.$add('items', item);
  console.info(`Assigned to ${isUserNew ? 'new' : 'existing'} user:`, user.username);
}

export async function handleIgnored(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const {issue: issueData} = data;
  const [item, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id},
    defaults: getItemDefaults(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked Sentry issue`);
  // Mark the item as ignored
  item.isIgnored = true;
  await item.save();
  console.info('Marked item as ignored');
}

export async function handleCreated(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  // Find or create an item to associate with the Sentry Issue
  const {issue: issueData} = data;
  const [, isItemNew] = await Item.findOrCreate({
    where: {sentryId: issueData.id},
    defaults: getItemDefaults(sentryInstallation, issueData),
  });
  console.info(`${isItemNew ? 'Created' : 'Found'} linked Sentry issue`);
}

export default function issueHandler(
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
): number {
  switch (action) {
    case 'resolved':
      handleResolved(sentryInstallation, data);
      return 202;

    case 'assigned':
      handleAssigned(sentryInstallation, data);
      return 202;

    case 'ignored':
      handleIgnored(sentryInstallation, data);
      return 202;

    case 'created':
    default:
      handleCreated(sentryInstallation, data);
      return 201;
  }
}

const getItemDefaults = (
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
