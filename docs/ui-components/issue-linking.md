# Issue Linking UI Component

## Testing

1. Ensure this application is running (`make serve-typescript` or `make serve-python`) and has been [installed on your organization in Sentry](../installation.md).
2. Navigate to any issue details page (Issues > Click on an Issue)
3. Once the page loads, find the 'Issue Tracking' section in the right side bar
4. Find your integration's Issue Link button
   - It will depend on what you named your integration (i.e. 'Link APP_NAME Issue')
5. Click it to bring up your application's Issue Link modal
   - The form fields in the 'Create' and 'Link' tabs of this modal come from the [`integration-schema.json` file](../../integration-schema.json), specifically the blob with `"type": "issue-link"`
6. Submit the appropriate form ('Create' to spawn a new ticket, 'Link' to update an existing one) to finalize the Issue Link on Sentry
7. Once submitted, the Issue Link should update to reflect the identifiers our app (e.g. 'IPE-DEMO #1').
8. Click this link to be directed to the relevant kanban board
9. Confirm the link by ensuring the item you created/selected has the appropriate Sentry ID attached to it.

## Code Insights

If you monitor the server logs while using the Issue Linking UI component in Sentry, you should see something similar to the following:

```
# Initial load of the UI component

Authorized: Verified request came from Sentry
Populating item options in Sentry

# Submitting the 'Create' form

Authorized: Verified request came from Sentry
Created item through Sentry Issue Link UI Component

# Submitting the 'Link' form

Authorized: Verified request came from Sentry
Linked item through Sentry Issue Link UI Component
```

All the authorization logs are coming from middleware which verifies the request signature with the shared secret:
   - [Python Signature Verification](../../backend-py/src/api/middleware/verify_sentry_signature.py)
   - [TypeScript Signature Verification](../../backend-ts/src/api/middleware/verifySentrySignature.ts) 

The 'Populating item options' log comes from the select field we specify in the schema:
   - [Integration Schema](../../integration-schema.json) (Look at the blob under `elements[0].link.required_fields`)

It tells Sentry what endpoint to ping and use to populate options in a Select field.
   - [Python Options Response Code](../../backend-py/src/api/endpoints/sentry/options.py)
   - [TypeScript Options Response Code](../../backend-ts/src/api/sentry/options.ts)

The 'Created/Linked item' logs come from Sentry pinging another endpoint we specify in the schema:
   - [Integration Schema](../../integration-schema.json) (Look at the `uri` property under `elements[0].link` and `elements[0].create`)
   - You can modify the payload that gets sent to these `uri` by editing the `required_fields` and `optional_fields` in the corresponding JSON blob
  
When a user in Sentry submits the create/link form, the payload gets sent to the URIs specified in those fields of the schema.
   - [Python Create/Link Handling](../../backend-py/src/api/endpoints/sentry/issue_link.py)
   - [TypeScript Create/Link Handling](../../backend-ts/src/api/sentry/issueLink.ts)
