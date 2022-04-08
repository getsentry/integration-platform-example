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

