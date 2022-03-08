import express from 'express';
import axios from 'axios';
import {SentryInstallations} from '../../models';

export type TokenResponseData = {
  expiresAt: string; // ISO date string at which token must be refreshed
  token: string; // Bearer token authorized to make Sentry API requests
  refreshToken: string; // Refresh token required to get a new Bearer token after expiration
};

export type VerifyResponseData = {
  app: {
    uuid: string; // UUID for your application (shared across installations)
    slug: string; // URL slug for your application (shared across installations)
  };
  organization: {
    slug: string; // URL slug for the organization doing the installation
  };
  uuid: string; // UUID for the individual installation
};

const router = express.Router();

router.get('/', async (req, res) => {
  // Destructure the all the query params we receive from the installation prompt
  const {code, installationId, orgSlug} = req.query;

  // Construct a payload to ask Sentry for a token on the basis that a user is installing
  const payload = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SENTRY_CLIENT_ID,
    client_secret: process.env.SENTRY_CLIENT_SECRET,
  };

  // Send that payload to Sentry and parse its response
  const tokenResponse: {data: TokenResponseData} = await axios.post(
    `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${installationId}/authorizations/`,
    payload
  );

  // Store the tokenData (i.e. token, refreshToken, expiresAt) for future requests
  //    - Make sure to associate the installationId and the tokenData since it's unique to the organization
  //    - Using the wrong token for the a different installation will result 401 Unauthorized responses
  const {token, refreshToken, expiresAt} = tokenResponse.data;
  await SentryInstallations.create({
    id: installationId as string,
    orgSlug: orgSlug as string,
    expiresAt: new Date(expiresAt),
    token,
    refreshToken,
  });

  // Verify the installation to inform Sentry of the success
  //    - This step is only required if you have enabled 'Verify Installation' on your integration
  const verifyResponse: {data: VerifyResponseData} = await axios.put(
    `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${installationId}/`,
    {status: 'installed'},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Continue the installation process
  //    - If your app requires additional configuration, this is where you can do it
  //    - The token/refreshToken can be used to make requests to Sentry's API -> https://docs.sentry.io/api/
  //    - Once you're done, you can optionally redirect the user back to Sentry as we do below
  console.info(`Installed ${verifyResponse.data.app.slug} on '${orgSlug}'`);
  res.redirect(
    `${process.env.SENTRY_URL}/settings/${orgSlug}/sentry-apps/${verifyResponse.data.app.slug}/`
  );
});

export default router;
