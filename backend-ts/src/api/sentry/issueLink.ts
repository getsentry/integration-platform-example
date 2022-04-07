import express from 'express';

import Item, {ItemColumn} from '../../models/Item.model';
import Organization from '../../models/Organization.model';
import SentryInstallation from '../../models/SentryInstallation.model';

type IssueLinkRequestData = {
  // The fields here are populated from integration-schema.json
  fields: Record<string, any>;
  issueId: string;
  installationId: string;
  webUrl: string;
  project: {slug: string; id: string};
  actor: {type: string; id: string; name: string};
};

const router = express.Router();

// TODO(Leander): Comment through all this code
// TODO(Leander): Refactor this into its own middleware
router.use(async (request, response, next) => {
  const issueLinkData = request.body as IssueLinkRequestData;
  const {installationId: uuid} = issueLinkData;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  const organization = await Organization.findOne({
    where: {id: sentryInstallation.organizationId},
  });
  if (!sentryInstallation || !organization) {
    return response.sendStatus(404);
  }
  response.locals.organization = organization;
  return next();
});

router.post('/link', async (request, response) => {
  const issueLinkData = request.body as IssueLinkRequestData;

  const item = await Item.findByPk(issueLinkData.fields.itemId);
  console.info('Linked Item through Sentry Issue Link UI Component');
  response.send({
    webUrl: `http://localhost:${process.env.REACT_APP_PORT}/${response.locals.organization.slug}/`,
    project: 'IPE-DEMO',
    identifier: `${item.id}`,
  });
});

router.post('/create', async (request, response) => {
  const issueLinkData = request.body as IssueLinkRequestData;

  const item = await Item.create({
    title: issueLinkData.fields.title,
    description: issueLinkData.fields.description,
    column: ItemColumn.Todo,
    organizationId: response.locals.organization.id,
    sentryId: issueLinkData.issueId,
  });

  console.info('Created Item through Sentry Issue Link UI Component');
  response.send({
    webUrl: `http://localhost:${process.env.REACT_APP_PORT}/${response.locals.organization.slug}/`,
    project: 'IPE-DEMO',
    identifier: `${item.id}`,
  });
});

export default router;
