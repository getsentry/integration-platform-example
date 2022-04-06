# Issue Webhooks

## Testing

1. With the application running (`make serve-typescript` or `make serve-python`), go to your frontend webpage (http://localhost:3000 by default)
2. Select an organization's kanban to view
3. Trigger the `issue.created` webhook by clicking 'Send Error to Sentry'
	- Use the input field to change the name of the error. If the name is changed, a new issue shall be created, rather than adding an event to the same issue.
4. Open Sentry, and navigate to Issues
5. Filter by selecting the project you created to this app's DSN (See [README, Step 2](../../README.md))
6. Find and select the new error you triggered ('Test Error #1' by default)
7. Trigger the `issue.assigned` webhook by selecting an assignee in the dropdown
	- Note: These webhooks only fire on the transition from Unassigned -> Assigned, not a change of assignee
8. Trigger the `issue.resolved` webhook by clicking the resolve button
9. Trigger the `issue.ignored` webhook by clicking the ignore button

## Code Insights

If you monitor server logs during the above issue webhook suite test, you should see something similar to the following:

```
# When an issue appears in Sentry for the first time

Authorized: Verified request came from Sentry
Received 'issue.created' webhook from Sentry
Created linked Sentry issue

# When a Sentry issue transitions from Unassigned to Assigned

Authorized: Verified request came from Sentry
Received 'issue.assigned' webhook from Sentry
Found linked Sentry issue
Assigned to existing user: leander.rodrigues@sentry.io

# When a Sentry issue is marked as resolved

Authorized: Verified request came from Sentry
Received 'issue.resolved' webhook from Sentry
Found linked Sentry issue
Updated item's column to DONE

# When a Sentry issue is ignored

Authorized: Verified request came from Sentry
Received 'issue.ignored' webhook from Sentry
Found linked Sentry issue
Marked item as ignored
```

Broadly, the steps in handling these webhooks are as follows:

1. Verify the signature. The authorization comes from verifying the request signature with the shared 
   - [Python Signature Verification](../../backend-py/src/api/middleware/auth.py)
   - [TypeScript Signature Verification](../../backend-ts/src/api/sentry/index.ts) 
2. Logging the type of webhook the application is receiving before handling it. This is helpful just for debugging and sanity checking.
   - [Python Webhook Logging](../../backend-py/src/api/endpoints/sentry/webhook.py)
   - [TypeScript Webhook Logging](../../backend-ts/src/api/sentry/webhook.ts)
3. Pass the webhook along to a dedicated handler to keep the webhook endpoint clean
   - [Python Issue Webhook Handler](../../backend-py/src/api/endpoints/sentry/handlers/issue_handler.py) 
   - [TypeScript Issue Webhook Handler](../../backend-ts/src/api/sentry/handlers/issueHandler.ts)
4. Check if the issue exists in our application
   - In this example, it's checking if we already have a ticket for the issue, and creating one if not
5. Act on the webhook
   - You can perform the whatever actions make sense for your application based on the webhook
   - In this reference implementation, it's largely changing the fields/properties of the tickets in the kanban board
6. Responsd with an appropriate status code
   - The integration dashboard in Sentry will reflect these status codes for more debugging help

# Error Webhooks

TODO(Leander): Write these