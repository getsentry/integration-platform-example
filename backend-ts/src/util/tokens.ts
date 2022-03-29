import axios from 'axios';

import {TokenResponseData} from '../api/sentry/setup';
import SentryInstallation from '../models/SentryInstallation.model';

export async function getRefreshedInstallation(installationId: string) {
  // In practice, this is where you'd want to fetch the installation that was previously stored.
  // For this example, imagine installation came from a database call
  const installation = await SentryInstallation.findByPk(installationId);

  // If the token is expired, we'll need to refresh it...
  if (installation.expiresAt.getTime() < Date.now()) {
    console.info(`Token for '${installation.orgSlug}' has expired. Refreshing...`);
    // 1. Construct a payload to ask Sentry for a new token
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: installation.refreshToken,
      client_id: process.env.SENTRY_CLIENT_ID,
      client_secret: process.env.SENTRY_CLIENT_SECRET,
    };

    // 2. Send that payload to Sentry and parse the response
    const tokenResponse: {data: TokenResponseData} = await axios.post(
      `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${installationId}/authorizations/`,
      payload
    );

    // 3. Store the token information for future requests
    const {token, refreshToken, expiresAt} = tokenResponse.data;
    const updatedInstallation = await installation.update({
      token,
      refreshToken,
      expiresAt: new Date(expiresAt),
    });
    console.info(`Token for '${updatedInstallation.orgSlug}' has been refreshed.`);

    // 4. Return the newly refreshed installation
    return updatedInstallation;
  }

  // If the installation is not expired, no need to refresh it
  return installation;
}
