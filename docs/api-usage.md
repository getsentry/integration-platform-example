# API Usage

This document will show you how to test this application's usage of the [Sentry API](https://docs.sentry.io/api/) and it's ability to refresh tokens.

## Testing

1. Ensure this application is running (`make serve-typescript` or `make serve-python`) and has been [installed on your organization in Sentry](../installation.md).
2. Select an organization's kanban to view
3. Link a Sentry issue with a kanban item
    - This can be done via the [issue webhooks](./event-webhooks.md#issue-webhooks) or [issue linking](../ui-components/issue-linking.md)
4. Once linked, refresh the kanban app.
5. The linked issue should appear with a `SHORT-ID` instead of the numerical ID we save to the database
    - This is replaced on the frontend by using the API Token that has been issued to our installation
6. To test token refreshing, modify the row in your database to manually expire the token.
    - E.g. DB Client > `sentrydemo` (default) > `sentry_installations` > `expires_at`
7. Now refresh the kanban app.
8. If the `SHORT-ID` still appears as a badge, our token was successfully refreshed.


## Code Insights

If you monitor server logs during the above install-uninstall test, you should see something similar to the following:

```
Token for leander-test has expired. 
Token for 'leander-test' has been refreshed.
```

These logs are created as part of the primitive Sentry API Client we've included in the repository. Here is where you'll find the code responsible for token refresh as well.
    - [Python Sentry API Client](../backend-py/src/util/sentry_api_client.py)
    - [TypeScript Sentry API Client](../backend-ts/src/util/SentryAPIClient.ts)

The only endpoint we enrich with Sentry API data is `/api/items`, which populates the items in the kanban app. 
    - [Python Sentry Data Usage](../backend-py/src/api/endpoints/items.py)
    - [TypeScript Sentry Data Usage](../backend-ts/src/api/items.ts)