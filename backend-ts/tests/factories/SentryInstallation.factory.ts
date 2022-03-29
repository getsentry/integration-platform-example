import {Attributes} from 'sequelize';

import SentryInstallation from '../../src/models/SentryInstallation.model';

export default async function createSentryInstallation(
  fields?: Partial<Attributes<SentryInstallation>>
) {
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
