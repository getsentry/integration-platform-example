# Installation / Uninstallation

## Testing

To test the installation flow, navigate to your Sentry instance and do the following:

1. Click Settings > Integrations
2. Click on your integration
   - This is the page your users will see when they search for your integration on Sentry
   - You can update the info on this page via Settings > Developer Settings > Your Integration
3. Click Accept & Install
   - If you've specified a Redirect URL on your integration, you should be sent there now
   - For this demo, we did specify a Redirect URL so you should arrive at the Frontend ngrok forwarding address
4. Select a Demo Organization to link to your Sentry Organization
5. Click Submit
   - You'll be redirected to Sentry after this. While optional, we recommend developers do this so users can confirm themselves that the installation was successful from both sides.

To test the uninstallation flow:

1. Navigate to your integration's installation (Settings > Integrations > Your Integration)
2. Click Uninstall and Confirm
  


## Code Insights

If you monitor server logs during the above install-uninstall test, you should see something similar to the following:

```
# Installation Request

1. Authorized: Verified request came from Sentry
2. Received 'installation.created' webhook from Sentry
3. Installed example on 'Bahringer LLC'

# Uninstallation Request

4. Authorized: Verified request came from Sentry
5. Received 'installation.deleted' webhook from Sentry
6. Uninstalled example from 'Bahringer LLC'
```

1. The authorization comes from verifying the request signature with the shared 
   - [Python Signature Verification](../backend-py/src/api/middleware/verify_sentry_signature.py)
   - [TypeScript Signature Verification](../backend-ts/src/api/middleware/verifySentrySignature.ts) 
2. The `installation.created` webhook is fine to ignore since we have set up a custom endpoint to which our Redirect URL's form submits:
   - [Python Installation Handling](../backend-py/src/api/endpoints/sentry/setup.py)
   - [Typescript Installation Handling](../backend-ts/src/api/sentry/setup.ts)
3. Confirmation that the code in #2 ran properly.
4. See #1
5. The `installation.deleted` webhook must be handled to remove the associated installation/token data
   - [Python Uninstallation Handling](../backend-py/src/api/endpoints/sentry/webhook.py)
   - [Typescript Uninstallation Handling](../backend-ts/src/api/sentry/webhook.ts)
6. Confirmation that the code in #5 ran properly.



