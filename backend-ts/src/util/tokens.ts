/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios';
import {TokenResponseData} from '../api/sentry/setup';

const tokenDataMap: {[key: string]: TokenResponseData} = {};

export function storeTokenDataInDatabase(
  installationId: string,
  tokenData: TokenResponseData
) {
  // In practice, this is where you'd want to make a database call to store the tokenData.
  // This will allow you to use it to make requests on behalf of the organization who installed it.
  // Each installation requires you to store its token, refreshToken and expiresAt time string
  // This is because they are unique to the organization who installed them, and will result wtih 401 Unauthorized responses if shared.
  tokenDataMap[installationId] = tokenData;
}

export async function retrieveTokenDataFromDatabase(installationId: string) {
  // In practice, this is where you'd want to fetch the tokenData that was previously stored.
  // For this example, imagine tokenData came from a database call
  const tokenData = tokenDataMap[installationId];

  // If the token is expired, we'll need to refresh it...
  if (Date.parse(tokenData.expiresAt) < Date.now()) {
    // 1. Construct a payload to ask Sentry for a new token
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: tokenData.refreshToken,
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
    storeTokenDataInDatabase(installationId, {token, refreshToken, expiresAt});

    // 4. Return the newly refreshed token
    return token;
  }

  // If the token is not expired, no need to refresh it
  return tokenData.token;
}
