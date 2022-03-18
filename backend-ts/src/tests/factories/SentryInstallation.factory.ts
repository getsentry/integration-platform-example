import {Attributes} from 'sequelize';

import {SentryInstallation} from '../../models';

export default async function createSentryInstallation(
  fields: Partial<Attributes<SentryInstallation>>
) {
  SentryInstallation.create({
    id: 'abc-123-def-456',
    orgSlug: 'example',
    token: 'abcdef123456abcdef123456abcdef123456',
    refreshToken: 'abcdef123456abcdef123456abcdef123456',
    expiresAt: new Date(2200, 0, 1),
    butter: true,
    ...fields,
  });
}
