
def handle_assigned(sentry_installation, data):
    # Find or create an item to associate with the Sentry Issue
    # Find or create a user to associate with the item
    pass


def handle_created(sentry_installation, data):
    # Find or create an item to associate with the Sentry Issue

    pass


def handle_ignored(sentry_installation, data):
    # Find or create an item to associate with the Sentry Issue
    # Mark the item as ignored
    pass


def handle_resolved(sentry_installation, data):
    # Find or create an item to associate with the Sentry Issue
    # Update the item's column to DONE
    pass


def issue_handler(action, sentry_installation, data):
    if action == "assigned":
        handle_assigned(sentry_installation, data)
        return 202
    elif action == "created":
        handle_created(sentry_installation, data)
        return 201
    elif action == "ignored":
        handle_ignored(sentry_installation, data)
        return 202
    elif action == 'resolved':
        handle_resolved(sentry_installation, data)
        print(f"Unhandled Sentry Issue action: {action}")
        return 200


def get_item_defaults(sentry_installation, issue_data):
    return {
        "organization_id": sentry_installation.organization_id,
        "title": issue_data.get('title'),
        "description": f"{issue_data.get('shortId')} - {issue_data.get('culprit')}",
        "column": "DONE" if issue_data.get('status') == "resolved" else "TODO",
        "is_ignored": issue_data.get('status') == "ignored",
        "sentry_id": issue_data.get('id'),
    }
