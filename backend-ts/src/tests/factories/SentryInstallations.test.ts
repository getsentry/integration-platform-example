import {Attributes} from 'sequelize';

import {SentryInstallations} from 'src/models';

export default async (fields: Partial<Attributes<SentryInstallations>>) =>
  SentryInstallations.create({
    id: 'abc-123-def-456',
    orgSlug: 'example',
    token: 'abcdef123456abcdef123456abcdef123456',
    refreshToken: 'abcdef123456abcdef123456abcdef123456',
    expiresAt: new Date(2200, 0, 1),
    ...fields,
  });
