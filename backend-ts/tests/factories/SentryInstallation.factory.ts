import {Attributes} from 'sequelize';

import SentryInstallation from '../../src/models/SentryInstallation.model';
import createOrganization from './Organization.factory';

export default async function createSentryInstallation(
  fields?: Partial<Attributes<SentryInstallation>>
) {
  if (!fields.organization_id) {
    const organization = await createOrganization();
    fields.organizationId = organization.id;
  }
  return SentryInstallation.create({
    uuid: 'abc-123-def-456',
    orgSlug: 'example',
    token: 'abcdef123456abcdef123456abcdef123456',
    refreshToken: 'abcdef123456abcdef123456abcdef123456',
    expiresAt: new Date(2200, 0, 1),
    ...fields,
  });
}
export {SentryInstallation};
