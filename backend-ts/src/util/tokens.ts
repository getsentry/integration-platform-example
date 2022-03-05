import axios from 'axios';
import {TokenResponseData} from '../api/sentry/setup';
import {SentryInstallations} from './../models';

export async function retrieveTokenDataFromDatabase(installationId: string) {
  // In practice, this is where you'd want to fetch the tokenData that was previously stored.
  // For this example, imagine tokenData came from a database call
  const installation = await SentryInstallations.findByPk(installationId);

  // If the token is expired, we'll need to refresh it...
  if (installation.expiresAt.getTime() < Date.now()) {
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
    await SentryInstallations.update(
      {
        token,
        refreshToken,
        expiresAt: new Date(expiresAt),
      },
      {where: {id: installationId}}
    );

    // 4. Return the newly refreshed token
    return token;
  }

  // If the token is not expired, no need to refresh it
  return installation.token;
}
