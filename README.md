# Integration Platform Example

So you want to integrate with the [Sentry Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). Great! We're looking forward to it 🎉 That's why we built out this codebase; clone/fork away!

This repository contains some basic starter code to act as a tool/reference for you to refer back to. In it, we'll be covering the following features:

- Handling Installation (with OAuth)
- Refreshing Tokens
- Verifying Installations
- Handling Uninstallations
- Handling Webhooks
- UI Components
  - Issue Creating/Linking
  - Stack Trace Linking
  - Alert Rule Actions

If we missed something, or you're still having trouble, feel free to [create an issue](https://github.com/sentry-ecosystem/integration-platform-example/issues), and we'll see what we can do! Happy Developing!


## Quickstart

### Step 1: Setup ngrok

To get started, you'll need access to [ngrok](https://ngrok.com/). ngrok is a tool which creates public URLs which redirect traffic to your locally running development server. Since Sentry requires an HTTP connection to your application, this is the easiest way to test changes without having to deploy constantly.

### Step 2: Setup your environment

We've included a `.env.sample` file for you to refer to when building out your environment. To set it up, change the filename to `.env` and fill replace the values with those unique to your application. All of these variables are passed to each dockerized application (i.e. `backend-ts`, `backend-py`, `frontend` and `database`).

After setting up your environment variables, you can specify a port for
[ngrok](https://ngrok.com/). This will depend on the application you're running:

```bash
ngrok http 5100 # Default for backend-py
# OR
ngrok http 5200 # Default for backend-ts
```

You should make a note of the `Forwarding` address given to you after running this command (e.g. `https://abc123def456.ngrok.io`)

### Step 3: Setup Sentry

To get your `SENTRY_CLIENT_ID` AND `SENTRY_CLIENT_SECRET`, you'll have to create a [public integration](https://docs.sentry.io/product/integrations/integration-platform/#public-integrations).

> Public Integrations are intended to be published to everyone using Sentry. If you only intend for your own organization to use the integration, please use an [internal integration](https://docs.sentry.io/product/integrations/integration-platform/#internal-integrations).

Now, you can set up your integration by going to Sentry and following these steps:

1. Click Settings > Developer Settings > New Public Integration
2. Give it a name, and author
3. Specify a Webhook and Redirect URL with your ngrok forwarding address
    - Webhook URL: `https://abc123def456.ngrok.io/api/sentry/webhook/`
    - Redirect URL: `https://abc123def456.ngrok.io/api/sentry/setup/`
> Using the method in Step 2, if your ngrok service restarts, you will be issued a new forwarding address. Keep in mind that you'll have to update this URL if that happens.
4. Ensure 'Verify Installation' is checked
<!-- TODO(Leander): Fill these in as we add more features -->
5. Click 'Save Changes'

Now at the bottom of the page, you should find your Client ID and Client Secret. Provide these in the `.env` file as `SENTRY_CLIENT_ID` and `SENTRY_CLIENT_SECRET`.

### Step 4: Build and serve the codebase

This example code comes with an optional frontend and a choice between two backends, one in NodeJS (Express + TS) and another in Python (Flask). To launch the application, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

Now, you can build the images for the project of your choice

```bash
make build-python # A python server built on Flask
# OR
make build-typescript # A node server built on Express with TypeScript
```

Next, spin up the services for your selection with:

```bash
make python
# OR
make typescript
```

### Step 5: Install your application

Now that your application is all set up, you can head over to Sentry to install it. Navigate to the Integration Directory (Settings > Integrations) and find your new application.

Click into it, and proceed to 'Accept & Install'.

Now that your integration has been installed, we can test out all of its features.

## Testing your Application

<!-- TODO(Leander): Add testing here -->


# Credits

- UIAvatars.com