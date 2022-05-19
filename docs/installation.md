# Installation / Uninstallation

> **Note**: Internal integrations do not need to perform installation/verification since they are automatically installed on the authoring organization. See [the docs](https://docs.sentry.io/product/integrations/integration-platform/internal-integration/) for details.

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
2. Click Uninstall
3. Click Confirm
  

## Code Insights

If you monitor server logs during the above install-uninstall test, you should see something similar to the following:

```
# Installation Request

Authorized: Verified request came from Sentry
Received 'installation.created' webhook from Sentry
Installed example on 'Bahringer LLC'

# Uninstallation Request

Authorized: Verified request came from Sentry
Received 'installation.deleted' webhook from Sentry
Uninstalled example from 'Bahringer LLC'
```

The authorization logs comes from verifying the request signature with the shared secret 
   - [Python Signature Verification](../backend-py/src/api/middleware/verify_sentry_signature.py)
   - [TypeScript Signature Verification](../backend-ts/src/api/middleware/verifySentrySignature.ts)
 
The `installation.created` webhook is fine to ignore since we have set up a custom endpoint to which our Redirect URL's form submits:
   - [Python Installation Handling](../backend-py/src/api/endpoints/sentry/setup.py)
   - [Typescript Installation Handling](../backend-ts/src/api/sentry/setup.ts)
  
The 'Installed app on organization' log confirms that we've verified the installation with Sentry

The `installation.deleted` webhook must be handled to remove the associated installation/token data
   - [Python Uninstallation Handling](../backend-py/src/api/endpoints/sentry/webhook.py)
   - [Typescript Uninstallation Handling](../backend-ts/src/api/sentry/webhook.ts)
  
The 'Uninstalled app from organization' log confirms that we've removed the Sentry installation from our database



