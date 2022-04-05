# Integration Platform Example

So you want to integrate with the [Sentry Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). Great! We're looking forward to it 🎉 That's why we built out this codebase; clone/fork away!

This repository contains some basic starter code to act as a tool/reference for you to refer back to. In it, we'll be covering the following features:

- Handling Installation (with OAuth)
- Refreshing Tokens
- Verifying Installations
- Handling Uninstallations
- Handling Webhooks
  - Issues/Errors
  - Comments
  - Alerts
- UI Components
  - Issue Creating/Linking
  - Stack Trace Linking
  - Alert Rule Actions

If we missed something, or you're still having trouble, feel free to [create an issue](https://github.com/sentry-ecosystem/integration-platform-example/issues), and we'll see what we can do! Happy Developing!

---

## Getting Started

### Prerequisites
  - [Sentry](https://sentry.io) - You must be either a Manager or Owner of an organization on Sentry
  - [Docker](https://docs.docker.com/get-docker/) - You must have docker installed on your local machine
  - Select a codebase - This demo application comes with a mock frontend and a choice between two backends, one in Node (Express, Sequelize, TypeScript) and another in Python (Flask, SQLAlchemy). Pick the commands/environment that is more appropriate for your implementation.

### Step 0: Choose an Integration

Before setting anything up, you must determine the type of integration you're building on Sentry's [Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). 

[Public integrations](https://docs.sentry.io/product/integrations/integration-platform/#public-integrations) are meant to be accessed by all Sentry Customers, regardless of whether or not they belong to your organization. 

If you only wish to provide an application to your team/organization, you should probably develop an [Internal integration](https://docs.sentry.io/product/integrations/integration-platform/#public-integrations). These are far easier to get up and running, as they skip the OAuth installation process and become immediately available for webhooks, UI components or API usage.

For the rest of this tutorial, we will assume you're building a public integration.

### Step 1: Setup ngrok

To get started, you'll need access to [ngrok](https://ngrok.com/). ngrok is a tool which lets you expose your locally running servers to the internet. Since Sentry requires an HTTP connection to your application, this is the easiest way to test changes without having to deploy constantly. You can find [installation instructions here](https://ngrok.com/download).

We recommend setting up [your configuration file](https://ngrok.com/docs#config-location) as follows: 

```yml
authtoken: abc123

tunnels:
  ipe-frontend:
    proto: http
    addr: 3000 # Make sure it matches REACT_APP_PORT in .env
  ipe-backend-py:
    proto: http
    addr: 5100 # Make sure it matches FLASK_RUN_PORT in .env
  ipe-backend-ts:
    proto: http
    addr: 5200 # Make sure it matches EXPRESS_LISTEN_PORT in .env
```

This will let you easily set up your tunnels with:

```shell
ngrok start --all
```

Otherwise, you can expose ports individually with:

```shell
ngrok http $PORT
```

### Step 2: Setup Sentry

Next, with your ngrok ports exposed, take a note of the forwarding addresses (ending with `.ngrok.io`), you'll need them to setup your integration within [Sentry](https://sentry.io/). 

```python
Forwarding    https://abc123.ngrok.io -> http://localhost:3000 # -> demo frontend
Forwarding    https://def456.ngrok.io -> http://localhost:5100 # -> demo python backend
Forwarding    https://ghi789.ngrok.io -> http://localhost:5200 # -> demo node backend
```

In your Sentry instance,

1. Click Settings > Developer Settings > New Public Integration
2. Give it an appropriate name and author
3. Specify a Webhook and Redirect URL with your ngrok forwarding address. Using the above example, with the python backend, it may look like this:
    - Webhook URL: `https://def456.ngrok.io/api/sentry/webhook/` 
    - Redirect URL: `https://abc123.ngrok.io/sentry/setup/`
> Note: On the free plan for ngrok, if your service restarts, [you will be issued a new forwarding address](https://ngrok.com/docs#getting-started-stable). If this happens, be sure to update these URLs in Sentry to keep your app functional while developing/testing.
4. Ensure 'Verify Installation' is checked
5. Enable 'Issue & Event - Read' permissions
6. Enable 'issue' webhooks (for created, resolved, assigned, and ignored actions)
<!-- TODO(Leander): Fill these in as we add more features -->
7. Click 'Save Changes'
8. Make a note of the **Client ID** and **Client Secret**

This demo integration can helpfully create errors in Sentry to trigger webhooks while developing. To enable this, you'll need to issue this app a DSN. To do so,

1. Click Projects > Create Project
2. Select React (JS)
3. Give it an appropriate name
4. Click Create Project
5. Make a note of the **DSN** URL

Next, we'll be taking these values from Sentry and putting together our application's environment.
### Step 3: Setup your Environment

We've included a `.env.sample` file for you to refer to when building out your environment. To set it up, change the filename from `.env.sample` to `.env`. Now you can change any of these values, but the pay close attention to a few of them:
  - `SENTRY_URL`: The instance of Sentry you're building upon (Use 'https://sentry.io' if not self-hosted)
  - `SENTRY_CLIENT_ID`: The Client ID from Step 2
  - `SENTRY_CLIENT_SECRET`: The CLIENT Secret from Step 2
  - `REACT_APP_SENTRY_DSN`: The DSN from Step 2
  - `REACT_APP_BACKEND_URL`: The complete address of your chosen backend
    - Use `http://localhost:$FLASK_RUN_PORT` for python, or `http://localhost:$EXPRESS_LISTEN_PORT` for node (default)
    - If there are issues with `localhost` and your configuration, you may want to use an corresponding ngrok forwarding address instead

> Note: If you change `REACT_APP_PORT`, `FLASK_RUN_PORT`, or `EXPRESS_LISTEN_PORT`, you may have to reconfigure your ngrok setup and Integration URLs in Sentry

Great, now we're ready to serve our application!
### Step 4: Build and serve the codebase

This example code comes with a mock frontend and a choice between two backends, one in NodeJS (Express + TS) and another in Python (Flask). To launch the application, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Now you can spin up the project of your choice with:

```bash
make serve-python # A python server built on Flask and SQLAlchemy
# OR
make serve-typescript # A typescript node server built on Express and Sequelize
```

Now the app is ready to test/demo! Consult the [Using your Integration](#using-your-integration) section to playground your application as you make changes and trigger webhooks in Sentry.

If, during development, you make changes to the `.env` file or dependencies, you'll need to rebuild the images with:

```bash
make build-python
# OR
make build-typescript
```

---

## Using your Integration

Building an app on our integration platform gives you access to lots of Sentry features. This section will detail how to go about testing them while building your integration.
### Testing Webhooks
  - [How to test installation/uninstallation](/docs/installation.md)
    - `installation.created`, `installation.deleted`
  - [How to test issue webhooks](/docs/webhooks/event-webhooks.md#issue-webhooks)
    - `issue.assigned`, `issue.created`, `issue.ignored`, `issue.resolved`
  - [How to test error webhooks](/docs/webhooks/event-webhooks.md#error-webhooks)
    - `error.created` _(Requires Business Plan, both to develop and install)_
  - [How to test comment webhooks](/docs/webhooks/comment-webhooks.md)
    - `comment.created`, `comment.edited`, `comment.deleted`
  - [How to test alerting webhooks](/docs/webhooks/alert-webhooks.md)
    - `event_alert.triggered` 
    - `metric_alert.critical`, `metric_alert.warning`, `metric_alert.resolved` _(Requires Business Plan, both to develop and install)_

### Testing UI Components
  - [Issue Linking/Creating](/docs/ui-components/issue-linking.md)
  - [Stacktrace Linking](/docs/ui-components/stacktrace-linking.md)
  - [Alert Rule UI Components](/docs/ui-components/alert-rule-actions.md)

---

## Credits

- [ui-avatars.com](https://ui-avatars.com/) - Simple API to generate initials from names
- [Create React App](https://create-react-app.dev/) - Scaffold out basic React application to kickstart the project