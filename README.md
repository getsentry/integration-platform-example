# Integration Platform Example

So you want to integrate with the [Sentry Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). Great! We're looking forward to it 🎉 
That's why we built out this codebase; clone and fork away!

This repository contains some starter code for interfacing with the Integration Platform that is meant to be a tool for your reference. In it, we'll be covering the following features:

- Handling Installation (with OAuth)
- Refreshing Tokens
- Verifying Installations
- Handling Uninstallations
- Handling Webhooks
  - Issues
  - Comments
  - Alerts
- UI Components
  - Issue Linking
  - Alert Rule Actions

If we missed something, or you're still having trouble, feel free to [create an issue](https://github.com/sentry-ecosystem/integration-platform-example/issues), and we'll see what we can do! Happy Developing!

## Table of Contents 

  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Step 0: Choose an Integration](#step-0-choose-an-integration)
    - [Step 1: Setup ngrok](#step-1-setup-ngrok)
    - [Step 2: Setup Sentry](#step-2-setup-sentry)
    - [Step 3: Setup your environment](#step-3-setup-your-environment)
    - [Step 4: Build and serve the codebase](#step-4-build-and-serve-the-codebase)
  - [Using your Integration](#using-your-integration)
    - [Testing Webhooks](#testing-webhooks)
    - [Testing UI Components](#testing-ui-components)
  - [Publishing](#publishing)
  - [Credits](#credits)

## Getting Started

### Prerequisites
  - [**Sentry**](https://sentry.io) - You must be either a Manager or Owner of an organization on Sentry.
  - [**Docker**](https://docs.docker.com/get-docker/) - This demo application uses Docker to setup and communicate between its different services.
  - **Disable your adblocker** - This is a common pitfall that developers fall into when building on Sentry, doing it early can save your time down the line!
  - **Select a codebase** - This demo application comes with a mock frontend and a choice between two backends, one in Node (Express, Sequelize, TypeScript) and another in Python (Flask, SQLAlchemy). Pick the commands and environment that is more appropriate for your implementation.
  - **A local PostgreSQL DB Client** (Optional) - Great for viewing changes on objects, and debugging, removing, or editing data. We suggest [Postico](https://eggerapps.at/postico/).

### Step 0: Choose an Integration

Before setting anything up, you must determine the type of integration you're building on Sentry's [Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). 

[Public integrations](https://docs.sentry.io/product/integrations/integration-platform/public-integration) are meant to be accessed by all Sentry Customers, regardless of whether or not they belong to your organization. 

If you only wish to provide an application to your team or organization, you should probably develop an [Internal integration](https://docs.sentry.io/product/integrations/integration-platform/internal-integration). These are far easier to get up and running, as they skip the OAuth installation process and become immediately available for webhooks, UI components or API usage.

This tutorial assumes you're building a public integration, but most of the steps are identical for internal integrations unless stated otherwise.

### Step 1: Setup ngrok

To get started, you'll need access to [ngrok](https://ngrok.com/). ngrok is a tool which lets you expose your locally running servers to the internet. Since Sentry requires an HTTP connection to your application, this is the easiest way to test changes without having to deploy constantly. You can find [installation instructions here](https://ngrok.com/download).

Make sure [you add an authtoken](https://ngrok.com/docs/ngrok-agent/ngrok#command-ngrok-config-add-authtoken) in order to generate a [configuration file](https://ngrok.com/docs/ngrok-agent/config). 

Open that configuration file and set it up as follows:

```yml
version: "2"
authtoken: <YOUR AUTHTOKEN HERE>

tunnels:
  acme-frontend:
    proto: http
    # Make sure this addr matches REACT_APP_PORT in .env
    addr: 3000 
  acme-backend-py:
    proto: http
    # Make sure addr matches FLASK_RUN_PORT in .env
    addr: 5100 
  acme-backend-ts:
    proto: http
    # Make sure addr matches EXPRESS_LISTEN_PORT in .env
    addr: 5200 
```

This will let you easily set up your tunnels with:

```shell
ngrok start --all
```

With ngrok running, you'll be presented with an interface that might look like the following:

```
ngrok

Session Status      online
Account             Sentry (Plan: Pro)
Version             3.0.3
Region              United States (us)
Latency             96.595653ms
Web Interface       http://127.0.0.1:4040
Forwarding          https://random-uuid-frontend.ngrok.io -> http://localhost:3000 
Forwarding          https://random-uuid-backend-py.ngrok.io -> http://localhost:5100 
Forwarding          https://random-uuid-backend-ts.ngrok.io -> http://localhost:5200 

Connections         ttl     opn     rt1     rt5     p50     p90
                    0       0       0.00    0.00    0.00    0.00
```

Take a note of the forwarding addresses (ending with `.ngrok.io`), as you'll need them to setup your integration within Sentry. You can identify which address coordinates with which server by the port they map to on your local machine. By default:

```
[Frontend address]           -> http://localhost:3000 
[Python backend address]     -> http://localhost:5100 
[Typescript backend address] -> http://localhost:5200
```

Though, if you change your [environment variables in Step 3](#step-3-setup-your-environment), from their default values, this will not be the case.

### Step 2: Setup Sentry

In your Sentry instance,

1. Click Settings > Developer Settings > Create New Integration > Public Integration
2. Give your integration an appropriate name and author.
3. Specify a Webhook and Redirect URL with your ngrok forwarding address. 
    - Webhook URL: `<YOUR BACKEND NGROK ADDRESS>/api/sentry/webhook/`    
    - Redirect URL: `<YOUR FRONTEND NGROK ADDRESS>/sentry/setup/`    
   Using the above example, with the python backend, it may look like this:
    - Webhook URL: `https://random-uuid-backend-py.ngrok.io/api/sentry/webhook/` 
    - Redirect URL: `https://random-uuid-frontend.ngrok.io/sentry/setup/`
> Note: On the free plan for ngrok, if your service restarts, you will be issued a new forwarding address. If this happens, be sure to update these URLs in Sentry to keep your app functional while developing or testing.
1. Ensure 'Verify Installation' is checked.
2. Ensure 'Alert Rule Action' is checked.
3. In the textbox for 'Schema', paste in the entire [`integration-schema.json` file](integration-schema.json)
4. Enable 'Issue & Event - Read' permissions.
5. Enable the webhooks 
   - `issue` (for `created`, `resolved`, `assigned`, and `ignored` actions)
   - `comment` (for `created`, `edited`, and `deleted` actions)
> Note: We aren't enabling `error.created` webhooks for this demo. See more on this decision [here](docs/webhooks/event-webhooks.md#error-webhooks).
6.  Click 'Save Changes'.
7. Make a note of the **Client ID** and **Client Secret**.

This demo integration can helpfully create errors in Sentry to trigger webhooks while developing, but you'll need to issue this app a DSN. 

1. Click Projects > Create Project.
2. Select React (JS).
3. Give your project an appropriate name (for example: Demo Integration).
4. Click Create Project.
5. Make a note of the **DSN** URL.
   - It is a URL similar to the following if you're using Sentry SaaS:
```
https://a9d7f6eed0d4883a62ea441b0ea2be81@o456798.ingest.sentry.io/123456
```

Next, we'll be taking these values from Sentry and putting together our application's environment.

### Step 3: Setup your environment

We've included a `.env.sample` file for you to refer to when building out your environment. To set it up, change the filename from `.env.sample` to `.env`. You can modify any of these variables as you see fit, but the following **require** changes to work as intended:
  - `SENTRY_CLIENT_ID`: The Client ID from Step 2
  - `SENTRY_CLIENT_SECRET`: The Client Secret from Step 2
  - `REACT_APP_SENTRY_DSN`: The DSN from Step 2
  - `REACT_APP_BACKEND_URL`: The ngrok forwarding address of your chosen backend from Step 1

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

This command will build the Docker images needed to run the application (a Postgres database, a web application, and your chosen backend), and spin them up, all in one step! Once the server logs calm down, your application should be good to go! If you make any changes to the environment variables after this point, be sure to rebuild the images with:

```bash
make setup-python 
# OR
make setup-typescript 
```

Now the app is ready to test! Continue on to the [Using your Integration](#using-your-integration) section to playground your application as you make changes and trigger webhooks in Sentry. There are also some helpful debugging commands which you can check out via:

```bash
make help
```

## Using your Integration

Building an app on our integration platform gives you access to lots of Sentry features. This section will detail how to go about testing them while building your integration.

### Testing Webhooks

  - [How to test installation and uninstallation](/docs/installation.md)
    - `installation.created`, `installation.deleted`
  - [How to test issue webhooks](/docs/webhooks/event-webhooks.md#issue-webhooks)
    - `issue.assigned`, `issue.created`, `issue.ignored`, `issue.resolved`
  - [How to test comment webhooks](/docs/webhooks/comment-webhooks.md)
    - `comment.created`, `comment.edited`, `comment.deleted`
  - [How to test alerting webhooks](/docs/webhooks/alert-webhooks.md)
    - `event_alert.triggered` 
    - `metric_alert.critical`, `metric_alert.warning`, `metric_alert.resolved` _(Requires Team Plan, both to develop and install)_

### Testing UI Components

  - [Issue Linking](/docs/ui-components/issue-linking.md)
  - [Alert Rule UI Components](/docs/ui-components/alert-rule-actions.md)

## Publishing

Once you've finalized, tested and deployed your application, you can submit a publication request on Sentry. Once it's reviewed, it'll be accessible to install by anyone on the Sentry platform.

Check out [the docs](https://docs.sentry.io/product/integrations/integration-platform/public-integration/#publication) to learn more about publishing.

## Credits

- [ui-avatars.com](https://ui-avatars.com/) - Simple API to generate initials from names
- [Create React App](https://create-react-app.dev/) - Scaffold out basic React application to kickstart the project