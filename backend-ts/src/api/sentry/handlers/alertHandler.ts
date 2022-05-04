import {Response} from 'express';

import Item, {ItemColumn} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';
import {convertSentryFieldsToDict, SchemaSettings, SentryField} from '../alertRuleAction';

// XXX(Leander): This assumes only one action for this integration per payload!
// Returns the alert settings as a mapping of field.name to field.value
function getSchemaSettings(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>,
  action?: string
): SchemaSettings {
  let fields = [] as SentryField[];
  // For issue alerts...
  if (data.event) {
    fields = data?.issue_alert?.settings ?? [];
  }
  // For metric alerts...
  else {
    const triggers = data?.metric_alert?.alert_rule?.triggers ?? [];
    const relevantTrigger = triggers.find(({label}: {label: string}) => label === action);
    const integrationAction = relevantTrigger?.actions?.find(
      ({sentry_app_installation_uuid: uuid}: {sentry_app_installation_uuid: string}) =>
        uuid === sentryInstallation.uuid
    );
    fields = integrationAction?.settings ?? [];
  }
  // Convert the list of fields to a mapping of name to value
  return convertSentryFieldsToDict(fields);
}

async function handleIssueAlert(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  const settings = getSchemaSettings(sentryInstallation, data);
  await Item.create({
    organizationId: sentryInstallation.organizationId,
    title: `🚨 Issue Alert: ${settings.title ?? data.event.title}`,
    description: settings.description ?? `Latest Trigger: ${data.event.web_url}`,
    column: ItemColumn.Todo,
    sentryId: data.event.issue_id,
    // data.issue_alert is only present for Alert Rule Action webhooks
    // See https://docs.sentry.io/product/integrations/integration-platform/webhooks/#issue-alerts
    sentryAlertId: data?.issue_alert?.id,
    assigneeId: settings.userId,
  });
  console.info('Created item from Sentry issue alert trigger');
}

async function handleMetricAlert(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>,
  action: 'resolved' | 'warning' | 'critical'
) {
  const [item, isItemNew] = await Item.findOrCreate({
    where: {
      organizationId: sentryInstallation.organizationId,
      // XXX(Ecosystem): The metric alert ID changes frequently, making it unreliable??
      sentryAlertId: data.metric_alert.id,
    },
  });
  let itemTitlePrefix = '';
  switch (action) {
    case 'resolved':
      itemTitlePrefix = '✅ Resolved Metric';
      break;
    case 'warning':
      itemTitlePrefix = '⚠️ Warning Metric';
      break;
    case 'critical':
      itemTitlePrefix = '🔥 Critical Metric';
      break;
  }
  const settings = getSchemaSettings(sentryInstallation, data, action);
  await item.update({
    title: `${itemTitlePrefix}: ${settings.title ?? data.metric_alert.title}`,
    description: settings.description ?? data.description_text,
    column: ItemColumn.Todo,
    assigneeId: settings.userId,
  });
  console.info(
    `${isItemNew ? 'Created' : 'Modified'} item from metric alert ${action} trigger`
  );
}

export default async function alertHandler(
  response: Response,
  resource: 'event_alert' | 'metric_alert',
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
): Promise<void> {
  // Issue Alerts (or Event Alerts) only have one type of action: 'triggered'
  if (resource === 'event_alert') {
    await handleIssueAlert(sentryInstallation, data);
    response.status(202);
  }
  // Metric Alerts have three types of actions: 'resolved', 'warning', and 'critical'
  else if (resource === 'metric_alert') {
    if (action === 'resolved' || action === 'warning' || action === 'critical') {
      await handleMetricAlert(sentryInstallation, data, action);
      response.status(202);
    } else {
      console.info(`Unhandled metric alert action: ${action}`);
      response.status(400);
    }
  } else {
    console.info(`Unexpected resource received: ${resource}`);
    response.status(400);
  }
}
