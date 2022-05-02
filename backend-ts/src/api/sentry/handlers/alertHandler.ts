import {Response} from 'express';

import SentryInstallation from '../../../models/SentryInstallation.model';

async function handleEventAlertTriggered(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  return await new Promise(() => {
    return;
  });
}

async function handleMetricAlertResolved(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  return await new Promise(() => {
    return;
  });
}

async function handleMetricAlertWarning(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  return await new Promise(() => {
    return;
  });
}

async function handleMetricAlertCritical(
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
) {
  return await new Promise(() => {
    return;
  });
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
