# Alert Rule Actions UI Component

## Setup

1. Ensure this application is running (`make serve-typescript` or `make serve-python`) and has been [installed on your organization in Sentry](../installation.md).
2. Create a new alert (Alerts > Create Alert)
3. To setup a test issue alert, select 'Issues' then 'Set Conditions'
   1. Give the rule a name, and a the 'A new issue is created' trigger
   2. In the action dropdown, select your integration
4. To setup a test metric alert, select 'Number of Errors' then 'Set Conditions'
   1. Set the critical, warning and resolved thresholds to `3`, `2` and `1` respectively
   2. Click 'Add Action' and select the trigger you'd like to test (e.g. 'Critical Status')
   3. Click the default action (e.g. 'Email') and select your integration
   4. Remember to give your rule a name
5. Click the 'Settings' button and fill in the form appropriately
   - The form fields in this modal come from the [`integration-schema.json` file](../../integration-schema.json), specifically the blob with `"type": "alert-rule-settings"`
6. Save the changes to your integration's setting form.
7. Save the alert rule.

## Testing

For testing, refer to [Alert Webhooks docs](../webhooks/alert-webhooks.md#testing).

## Code Insights


For code insights, refer to [Alert Webhooks docs](../webhooks/alert-webhooks.md#code-insights).

It should be noted that the only difference in alert webhook consumption when Alert Rule Actions are enabled is the precense of extra, custom data on each payload. See [the public docs](https://docs.sentry.io/product/integrations/integration-platform/ui-components/alert-rule-action) for more info.