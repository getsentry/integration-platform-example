# Comment Webhooks

## Testing

1. Ensure this application is running (`make serve-typescript` or `make serve-python`) and has been [installed on your organization in Sentry](../installation.md).
2. Link a Sentry issue with a kanban item
    - This can be done via the [issue webhooks](./event-webhooks.md#issue-webhooks) or [issue linking](../ui-components/issue-linking.md)
3. Once linked, open the issue details page in Sentry
4. Go to the 'Activity' tab
5. Trigger the `comment.created` webhook by leaving a comment on the activity log
6. Switch to the kanban app and refresh to see the new comment.
7. Trigger the `comment.updated` webhook by hovering your comment, clicking the 'Edit' button, and submitting a change.
8. Refresh again to see the modification to the comment.
9. Trigger the `comment.deleted` webhook by hovering your comment,clicking the 'Remove' button, and confirming.
10. Refresh one last time to verify that the comment has been deleted. 

## Code Insights

If you monitor server logs during the above issue webhook suite test, you should see something similar to the following:

```
Authorized: Verified request came from Sentry

Received 'comment.created' webhook from Sentry
Added new comment from Sentry issue

Received 'comment.updated' webhook from Sentry
Updated comment from Sentry issue

Received 'comment.deleted' webhook from Sentry
Deleted comment from Sentry issue
```

Broadly, the steps in handling these webhooks are as follows:

1. Verify the signature. The authorization comes from verifying the request signature with the shared secret
   - [Python Signature Verification](../../backend-py/src/api/middleware/verify_sentry_signature.py)
   - [TypeScript Signature Verification](../../backend-ts/src/api/middleware/verifySentrySignature.ts) 

2. Logging the type of webhook the application is receiving before handling it. This is helpful just for debugging and sanity checking.
   - [Python Webhook Logging](../../backend-py/src/api/endpoints/sentry/webhook.py)
   - [TypeScript Webhook Logging](../../backend-ts/src/api/sentry/webhook.ts)
  
3. Pass the webhook along to a dedicated handler to keep the webhook endpoint clean
   - [Python Comment Webhook Handler](../../backend-py/src/api/endpoints/sentry/handlers/comment_handler.py) 
   - [TypeScript Comment Webhook Handler](../../backend-ts/src/api/sentry/handlers/commentHandler.ts)
  
4. Check if the issue exists in our application
   - In this example, we drop comments that occur on Sentry issues that haven't been linked, with log similar to `Ignoring comment for unlinked Sentry issue`
  
5. Act on the webhook
   - Acting on every one of these webhooks in your application for a linked issue can create a 'comment-sync' experience for your user
   - Leverage linking the issue as soon as it appears in Sentry via [issue](./event-webhooks.md#issue-webhooks) and [alert](./alert-webhooks.md). If you need more custom data, see the [Alert Rule Action UI Component docs](../ui-components/alert-rule-actions.md) 


6. Respond with an appropriate status code
   - The integration dashboard in Sentry will reflect these status codes for more debugging help
