import express from 'express';
import axios from 'axios';

type TokenResponseData = {
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

router.post('/', async (req, res) => {
  console.log({setup: req.body});
  res.sendStatus(200);
});

router.get('/', async (req, res) => {
  console.log('Starting installation process...');
  // 1. Destructure the all the query params we receive from the installation prompt
  const {code, installationId, orgSlug} = req.query;

  // 2. Construct a payload to ask Sentry for a token on the basis that a user is installing
  const payload = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SENTRY_CLIENT_ID,
    client_secret: process.env.SENTRY_CLIENT_SECRET,
  };

  // 3. Send that payload to the Sentry instance and parse its response
  const tokenResponse = await axios.post(
    `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${installationId}/authorizations/`,
    payload
  );
  const tokenResponseData: TokenResponseData = tokenResponse.data;

  // 4. Store the token information for future requests
  const {token, refreshToken, expiresAt} = tokenResponseData;

  // 5. Verify the installation to inform Sentry of the success
  //    - This step is only required if you have enabled 'Verify Installation' on your integration
  const verifyResponse = await axios.put(
    `${process.env.SENTRY_URL}/api/0/sentry-app-installations/${installationId}/`,
    {status: 'installed'},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // 6. Continue the installation process
  //    - If your app requires additional configuration, this is where you can do it
  //    - The token/refreshToken can be used to make requests to Sentry's API -> https://docs.sentry.io/api/
  //    - Once you're done, you can redirect the user back to Sentry, as we do below
  const verifyResponseData: VerifyResponseData = verifyResponse.data;
  console.info(`Installed ${verifyResponseData.app.slug} on '${orgSlug}'`);
  res.redirect(
    `${process.env.SENTRY_URL}/settings/${orgSlug}/sentry-apps/${verifyResponseData.app.slug}/`
  );
});

export default router;
