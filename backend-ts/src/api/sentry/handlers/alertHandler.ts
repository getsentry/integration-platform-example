import {Response} from 'express';
import {Op} from 'sequelize';

import Item, {ItemColumn} from '../../../models/Item.model';
import SentryInstallation from '../../../models/SentryInstallation.model';
import {getItemDefaultsFromSentry} from './issueHandler';

async function handleEventAlertTriggered(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  const issueData = data.event;
  const itemDefaults = getItemDefaultsFromSentry(sentryInstallation, issueData);
  await Item.create({
    ...itemDefaults,
    title: `🚨 Issue Alert: ${itemDefaults.title}`,
    description: `Triggering event: ${issueData.web_url}`,
  });
  console.info('Created item from Sentry issue alert trigger');
}

async function handleMetricAlertResolved(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  await Item.create({
    organizationId: sentryInstallation.organizationId,
    title: `✅ Resolved Metric: ${data.metric_alert.alert_rule.title}`,
    description: data.description_text,
    column: ItemColumn.Todo,
  });
  console.info('Created item from metric alert resolved trigger');
}

async function handleMetricAlertWarning(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  await Item.create({
    organizationId: sentryInstallation.organizationId,
    title: `⚠️ Warning Metric: ${data.metric_alert.alert_rule.title}`,
    description: data.description_text,
    column: ItemColumn.Todo,
  });
  console.info('Created item from metric alert warning trigger');
}

async function handleMetricAlertCritical(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  await Item.create({
    organizationId: sentryInstallation.organizationId,
    title: `🔥 Critical Metric: ${data.metric_alert.alert_rule.title}`,
    description: data.description_text,
    column: ItemColumn.Todo,
  });
  console.info('Created item from metric alert critical trigger');
}

export default async function alertHandler(
  response: Response,
  resource: 'event_alert' | 'metric_alert',
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
): Promise<void> {
  if (resource === 'event_alert') {
    // The only action for 'event_alert' is 'triggered'
    await handleEventAlertTriggered(sentryInstallation, data);
    response.status(202);
  } else if (resource === 'metric_alert') {
    switch (action) {
      case 'resolved':
        await handleMetricAlertResolved(sentryInstallation, data);
        response.status(202);
        break;
      case 'warning':
        await handleMetricAlertWarning(sentryInstallation, data);
        response.status(202);
        break;
      case 'critical':
        await handleMetricAlertCritical(sentryInstallation, data);
        response.status(202);
        break;
      default:
        console.info(`Unhandled Metric Alert action: ${action}`);
        response.status(400);
    }
  } else {
    console.info(`Unexpected resource received: ${resource}`);
    response.status(400);
  }
}
