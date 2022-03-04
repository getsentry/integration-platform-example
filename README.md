# Integration Platform Example

So you want to integrate with the [Sentry Integration Platform](https://docs.sentry.io/product/integrations/integration-platform/). Great! We're looking forward to it 🎉 That's why we built out this codebase; clone/fork away!.

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

This example code comes with an optional frontend and a choice between two backends, one in NodeJS (Express + TS) and another in Python (Flask). To launch the application, you'll need to install [Docker](https://docs.docker.com/engine/install/) and ensure it is running.

The first step is to build the images for the project of your choice

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
