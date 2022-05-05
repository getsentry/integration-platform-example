import express, {NextFunction, Request, Response} from 'express';

import Item, {ItemColumn} from '../../models/Item.model';
import Organization from '../../models/Organization.model';
import SentryInstallation from '../../models/SentryInstallation.model';

// The shape of your settings will depend on how you configure your schema
// This example coordinates with integration-schema.json for 'issue-link'
type IssueLinkSettings = {
  title?: string;
  description?: string;
  column?: ItemColumn;
  complexity?: string;
  itemId?: string;
};

type IssueLinkRequestData = {
  fields: IssueLinkSettings;
  issueId: string;
  installationId: string;
  webUrl: string;
  project: {slug: string; id: string};
  actor: {type: string; id: string; name: string};
};

const router = express.Router();

router.use(getOrganizationFromRequest);

router.post('/create', async (request, response) => {
  // The blob with the key "create" beside {"type": "issue-link"} in integration-schema.json
  // specifies the fields we'll have access to in this endpoint (on issueLinkData.fields).
  const issueLinkData = request.body as IssueLinkRequestData;

  // Create an item in our application from the Sentry Issue and user provided data
  const item = await Item.create({
    title: issueLinkData.fields.title,
    description: issueLinkData.fields.description,
    column: issueLinkData.fields.column ?? ItemColumn.Todo,
    complexity: parseInt(issueLinkData.fields.complexity) ?? 0,
    organizationId: response.locals.organization.id,
    sentryId: issueLinkData.issueId,
  });
  console.info('Created item through Sentry Issue Link UI Component');

  // Respond to Sentry with the exact fields it requires to complete the link.
  response.status(201).send({
    webUrl: `http://localhost:${process.env.REACT_APP_PORT}/${response.locals.organization.slug}/`,
    project: 'IPE-DEMO',
    identifier: `${item.id}`,
  });
});

router.post('/link', async (request, response) => {
  // The blob with the key "link" beside {"type": "issue-link"} in integration-schema.json
  // specifies the fields we'll have access to in this endpoint (on issueLinkData.fields).
  const issueLinkData = request.body as IssueLinkRequestData;

  // Associate the Sentry Issue with the item from our application the user selected.
  const item = await Item.findByPk(issueLinkData.fields.itemId);
  await item.update({sentryId: issueLinkData.issueId});
  console.info('Linked item through Sentry Issue Link UI Component');

  // Respond to Sentry with the exact fields it requires to complete the link.
  response.status(200).send({
    webUrl: `http://localhost:${process.env.REACT_APP_PORT}/${response.locals.organization.slug}/`,
    project: 'IPE-DEMO',
    identifier: `${item.id}`,
  });
});

// Helper middleware to attach the organization to response.locals.
async function getOrganizationFromRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const issueLinkData = request.body as IssueLinkRequestData;
  const {installationId: uuid} = issueLinkData;
  const sentryInstallation = await SentryInstallation.findOne({
    where: {uuid},
  });
  if (!sentryInstallation) {
    return response.sendStatus(404);
  }
  const organization = await Organization.findOne({
    where: {id: sentryInstallation.organizationId},
  });
  if (!organization) {
    return response.sendStatus(404);
  }
  response.locals.organization = organization;
  return next();
}

export default router;
