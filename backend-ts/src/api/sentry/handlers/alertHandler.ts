import {Response} from 'express';

import SentryInstallation from '../../../models/SentryInstallation.model';

export default async function alertHandler(
  response: Response,
  resource: 'event_alert' | 'metric_alert',
  action: string,
  sentryInstallation: SentryInstallation,
  data: Record<string, any>
): Promise<void> {
  console.log(data);

  switch (action) {
    case 'assigned':
      response.status(202);
      break;
    case 'created':
      response.status(201);
      break;
    case 'ignored':
      response.status(202);
      break;
    case 'resolved':
      response.status(202);
      break;
    default:
      console.info(`Unhandled Sentry Issue action: ${action}`);
      response.status(400);
  }
}
