import {Attributes} from 'sequelize';

import Organization from '../../src/models/Organization.model';

export default async function createOrganization(
  fields?: Partial<Attributes<Organization>>
) {
  return Organization.create({
    name: 'example',
    slug: 'example',
    externalSlug: 'sentry-example',
    ...fields,
  });
}
export {Organization};
