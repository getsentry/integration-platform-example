import * as Sentry from '@sentry/react';

export async function makeBackendRequest(
  path: string,
  data?: Record<string, any>,
  options?: RequestInit
) {
  const baseEndpoint = process.env.REACT_APP_BACKEND_HOST;
  const res = await fetch(`${baseEndpoint}${path}`, {
    mode: 'cors',
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    method: 'GET',
    body: JSON.stringify(data),
    ...options,
  });
  return res.json();
}

export async function triggerError(message: string) {
  class SentryCustomError extends Error {
    constructor() {
      super();
      // Here, we're setting a unique name so that Sentry
      // doesn't combine the events into a single issue
      this.name = message;
      this.message = 'This is a test error!';
    }
  }
  Sentry.captureException(new SentryCustomError());
}
