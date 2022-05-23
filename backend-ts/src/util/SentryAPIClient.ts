import axios, {AxiosResponse, Method} from 'axios';

import {TokenResponseData} from '../api/sentry/setup';
import Organization from '../models/Organization.model';
import SentryInstallation from '../models/SentryInstallation.model';

class SentryAPIClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Fetches an organization's Sentry API token, refreshing it if necessary.
   */
  static async getSentryAPIToken(organization: Organization) {
    const sentryInstallation = await SentryInstallation.findOne({
      where: {organizationId: organization.id},
    });

    // If the token is not expired, no need to refresh it
    if (sentryInstallation.expiresAt.getTime() > Date.now()) {
      return sentryInstallation.token;
    }

    // If the token is expired, we'll need to refresh it...
    console.info(`Token for '${sentryInstallation.orgSlug}' has expired. Refreshing...`);
    // Construct a payload to ask Sentry for a new token
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: sentryInstallation.refreshToken,
      client_id: process.env.SENTRY_CLIENT_ID,
      client_secret: process.env.SENTRY_CLIENT_SECRET,
    };

    // Send that payload to Sentry and parse the response
    const tokenResponse: {data: TokenResponseData} = await axios.post(
      `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${sentryInstallation.uuid}/authorizations/`,
      payload
    );

    // Store the token information for future requests
    const {token, refreshToken, expiresAt} = tokenResponse.data;
    const updatedSentryInstallation = await sentryInstallation.update({
      token,
      refreshToken,
      expiresAt: new Date(expiresAt),
    });
    console.info(`Token for '${updatedSentryInstallation.orgSlug}' has been refreshed.`);

    // Return the newly refreshed token
    return updatedSentryInstallation.token;
  }

  // We create static wrapper on the constructor to ensure our token is always refreshed
  static async create(organization: Organization) {
    const token = await SentryAPIClient.getSentryAPIToken(organization);
    return new SentryAPIClient(token);
  }

  public async request(
    method: Method,
    path: string,
    data?: object
  ): Promise<AxiosResponse | void> {
    const response = await axios({
      method,
      url: `${process.env.SENTRY_URL}/api/0${path}`,
      headers: {Authorization: `Bearer ${this.token}`},
      data,
    }).catch(e => {
      // TODO(you): Catch these sorta errors in Sentry!
      console.error('A request to the Sentry API failed:', {
        status: e.response.status,
        statusText: e.response.statusText,
        data: e.response.data,
      });
    });
    return response;
  }

  public get(path: string): Promise<AxiosResponse | void> {
    return this.request('GET', path);
  }

  // TODO(you): Extend as you see fit!
}

export default SentryAPIClient;
