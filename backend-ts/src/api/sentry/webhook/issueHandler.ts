import Item, {ItemColumn} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';
import User from '../../../models/User.model';

export async function handleResolved(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  const {issue: issueData} = data;

  await Item.create({
    title: issueData.title,
    description: `${issueData.culprit} - ${issueData.permalink}`,
    column: ItemColumn.Todo,
    organizationId: sentryInstallation.organizationId,
  });
}

export async function handleAssigned(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  const {issue: issueData} = data;
  console.log(issueData);
  const item = await Item.findOne({where: {sentryId: issueData.id}});
  const {email} = issueData.assignedTo;
  console.log(item);
  // await User.findOrCreate({
  //   username: email as string,
  //   // avatar: gravatar
  // });
  // const user = await User.findOne({where: {username: }});
  // if (item) {
  //   console.log('getting here');
  // }
}

export async function handleIgnored(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  return;
  // Change isIgnored
}

export async function handleCreated(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  console.log(sentryInstallation);
  const {issue: issueData} = data;
  await Item.create({
    title: issueData.title,
    description: `${issueData.culprit} - ${issueData.permalink}`,
    column: ItemColumn.Todo,
    organizationId: sentryInstallation.organizationId,
    sentryId: issueData.id,
  });
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
