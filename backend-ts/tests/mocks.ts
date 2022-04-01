export const UUID = '7a485448-a9e2-4c85-8a3c-4f44175783c9';

export const INSTALLATION = {
  app: {
    uuid: '64bf2cf4-37ca-4365-8dd3-6b6e56d741b8',
    slug: 'app',
  },
  organization: {
    slug: 'example',
  },
  uuid: UUID,
};

export const MOCK_SETUP = {
  postInstall: {
    code: 'installCode',
    installationId: UUID,
    sentryOrgSlug: 'example',
  },
  newToken: {
    token: 'abc123',
    refreshToken: 'def456',
    expiresAt: '2022-01-01T08:00:00.000Z',
  },
  installation: INSTALLATION,
};

export const MOCK_INSTALLATION_CREATED_WEBHOOK = {
  action: 'created',
  data: {installation: INSTALLATION},
  installation: INSTALLATION,
};

export const MOCK_INSTALLATION_DELETED_WEBHOOK = {
  action: 'deleted',
  data: {installation: INSTALLATION},
  installation: INSTALLATION,
};

export const MOCK_WEBHOOK = {
  'installation.deleted': MOCK_INSTALLATION_DELETED_WEBHOOK,
  'installation.created': MOCK_INSTALLATION_CREATED_WEBHOOK,
};
