# Alert Webhooks

## Setup

> **Note**: If you've configured Alert Rule Actions, you should refer to the [those setup instructions](../ui-components/alert-rule-actions.md) instead.

1. Ensure this application is running (`make serve-typescript` or `make serve-python`) and has been [installed on your organization in Sentry](../installation.md).
2. Create a new alert (Alerts > Create Alert)
3. To setup a test issue alert, select 'Issues' then 'Set Conditions'
   1. Give the rule a name, and a the 'A new issue is created' trigger
   2. In the action dropdown, select 'Send a notification via an integration'
   3. In the integration dropdown, select your integration.
4. To setup a test metric alert, select 'Number of Errors' then 'Set Conditions'
   1. Set the critical, warning and resolved thresholds to `3`, `2` and `1` respectively
   2. Click 'Add Action' and select the trigger you'd like to test (e.g. 'Critical Status')
   3. Click the default action (e.g. 'Email') and select your integration
   4. Remember to give your rule a name
5. Save the alert rule.

## Testing

1. To trigger your issue alert:
   1. Go to your frontend webpage (http://localhost:3000 by default)
   2. Trigger a new issue by clicking 'Send Error to Sentry'
   3. Wait for a moment, while the `event_alert.triggered` webhooks are sent to your application.
2. To trigger your metric alerts:
   1. Go to your frontend webpage (http://localhost:3000 by default)
   2. Trigger a new issue by clicking 'Send Error to Sentry' and refresh the page.
   3. Do this an appropriate number of times to trigger the appropriate incident (e.g. twice for a warning, thrice for a critical)
   4. Wait for a moment, while the `metric_alert` webhooks are sent to your application.
3. To test alert triggers repeatedly while developing, we recommend take advantage of the [ngrok's inspection interface](https://ngrok.com/docs/secure-tunnels#inspecting-requests) (located by default on http://localhost:4040/inspect/http)


## Code Insights

If you monitor server logs during the above alert rule webhooks test, you should see something similar to the following:

```
# Triggered when Sentry renders your async settings form fields

Authorized: Verified request came from Sentry
Populating user options in Sentry

# Allows the Sentry User to save the alert rule

Successfully validated Sentry alert rule

# Logs the successful handling of the relevant webhook

Created item from issue alert trigger
Warning item from metric alert warning trigger
Modified item from metric alert critical trigger
Modified item from metric alert resolved trigger
```

All the authorization logs are coming from middleware which verifies the request signature with the shared secret:
   - [Python Signature Verification](../../backend-py/src/api/middleware/verify_sentry_signature.py)
   - [TypeScript Signature Verification](../../backend-ts/src/api/middleware/verifySentrySignature.ts) 

The 'Populating user options' log comes from the select field we specify in the schema:
   - [Integration Schema](../../integration-schema.json) (Look at the blob under `elements[1].settings.required_fields`)

It tells Sentry what endpoint to ping and use to populate options in a Select field.
   - [Python Options Response Code](../../backend-py/src/api/endpoints/sentry/options.py)
   - [TypeScript Options Response Code](../../backend-ts/src/api/sentry/options.ts)

The 'Successful validation' log comes from Sentry pinging another endpoint we specifiy in the schema
   - [Integration Schema](../../integration-schema.json) (Look at the blob under `elements[1].uri`)

Here, we're validate the settings the user sent to our application and tell Sentry whether or not they should approve the changes to the alert rule. If somethings incorrect, we can surface error messages directly to the user in Sentry.
   - [Python Settings Approval Code](../../backend-py/src/api/endpoints/sentry/alert_rule_action.py) 
   - [TypeScript Settings Approval Code](../../backend-ts/src/api/sentry/alertRuleAction.ts)

The 'Created/Modified item' logs come from the consumption of the alert webhooks. 
   - [Python Alert Webhook Consumption](../../backend-py/src/api/endpoints/sentry/handlers/alert_handler.py)
   - [TypeScript Alert Webhook Consumption](../../backend-ts/src/api/sentry/handlers/alertHandler.ts)