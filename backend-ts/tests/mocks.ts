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

export const ISSUE = {
  id: '123',
  shortId: 'IPE-1',
  title: 'Error #1: This is a test error!',
  culprit: 'SentryCustomError(frontend/src/util)',
  level: 'error',
  status: 'unresolved',
  statusDetails: {},
  isPublic: false,
  platform: 'javascript',
  project: {
    id: '456',
    name: 'ipe',
    slug: 'ipe',
    platform: 'javascript-react',
  },
  type: 'error',
  metadata: {
    value: 'This is a test error!',
    type: 'Another Error #1',
    filename: '/frontend/src/util.ts',
    function: 'SentryCustomError',
    display_title_with_tree_label: false,
  },
  numComments: 0,
  assignedTo: {
    email: 'person@example.com',
    type: 'user',
    id: '789',
    name: 'Person',
  },
  isBookmarked: false,
  isSubscribed: false,
  hasSeen: false,
  isUnhandled: false,
  count: '1',
  userCount: 1,
  firstSeen: '2022-04-04T18:17:18.320000Z',
  lastSeen: '2022-04-04T18:17:18.320000Z',
};

const EVENT = {
  event_id: 'def456',
  platform: ISSUE.platform,
  datetime: ISSUE.firstSeen,
  culprit: ISSUE.culprit,
  metadata: ISSUE.metadata,
  title: ISSUE.title,
  issue_id: ISSUE.id,
  environment: 'production',
  web_url: `https://sentry.io/organizations/lxyz/issues/${ISSUE.id}/events/def456/`,
  breadcrumbs: {},
  contexts: {},
  sdk: {},
};

export const ALERT_RULE_ACTION_VALUES = {
  title: 'Alert Rule Action Item Title',
  description: 'Alert Rule Action Item Description',
  userId: 1,
};

const ALERT_RULE_ACTION_SETTINGS = Object.entries(ALERT_RULE_ACTION_VALUES).map(
  ([name, value]) => ({name, value})
);

const ISSUE_ALERT_WITH_ALERT_RULE_ACTION = {
  id: '456',
  title: 'issue alert',
  settings: ALERT_RULE_ACTION_SETTINGS,
};

export const METRIC_ALERT = {
  id: '789',
  alert_rule: {
    id: '456',
    name: 'metric alert',
    status: 0,
    triggers: [] as any[],
  },
  status: 2,
  status_method: 3,
  type: 2,
  title: 'metric alert',
};

const METRIC_ALERT_WITH_ALERT_RULE_ACTION = {
  ...METRIC_ALERT,
  alert_rule: {
    ...METRIC_ALERT['alert_rule'],
    triggers: [
      {
        label: 'critical',
        actions: [
          {
            type: 'sentry_app',
            settings: ALERT_RULE_ACTION_SETTINGS,
            sentry_app_installation_uuid: UUID,
          },
        ],
      },
      {
        label: 'warning',
        actions: [
          {
            type: 'sentry_app',
            settings: ALERT_RULE_ACTION_SETTINGS,
            sentry_app_installation_uuid: UUID,
          },
        ],
      },
    ],
  },
};

const METRIC_ALERT_DESCRIPTION = '5 events in the last 10 minutes';

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

const MOCK_INSTALLATION_CREATED_WEBHOOK = {
  action: 'created',
  data: {installation: INSTALLATION},
  installation: INSTALLATION,
};

const MOCK_INSTALLATION_DELETED_WEBHOOK = {
  action: 'deleted',
  data: {installation: INSTALLATION},
  installation: INSTALLATION,
};

const MOCK_ISSUE_ASSIGNED_WEBHOOK = {
  action: 'assigned',
  data: {issue: ISSUE},
  installation: INSTALLATION,
};

const MOCK_ISSUE_CREATED_WEBHOOK = {
  action: 'created',
  data: {issue: ISSUE},
  installation: INSTALLATION,
};

const MOCK_ISSUE_IGNORED_WEBHOOK = {
  action: 'ignored',
  data: {issue: {...ISSUE, status: 'ignored'}},
  installation: INSTALLATION,
};

const MOCK_ISSUE_RESOLVED_WEBHOOK = {
  action: 'resolved',
  data: {issue: {...ISSUE, status: 'resolved'}},
  installation: INSTALLATION,
};

const MOCK_BASE_COMMENT_WEBHOOK = {
  data: {
    comment_id: 456,
    issue_id: ISSUE.id,
    project_slug: 'ipe',
    timestamp: '2022-01-01T00:00:00.000000Z',
    comment: 'this is a test comment',
  },
  actor: {
    type: 'user',
    id: 123,
    name: 'name',
  },
  installation: INSTALLATION,
};

const MOCK_COMMENT_CREATED_WEBHOOK = {
  ...MOCK_BASE_COMMENT_WEBHOOK,
  action: 'created',
};

const MOCK_COMMENT_UPDATED_WEBHOOK = {
  ...MOCK_BASE_COMMENT_WEBHOOK,
  action: 'updated',
};

const MOCK_COMMENT_DELETED_WEBHOOK = {
  ...MOCK_BASE_COMMENT_WEBHOOK,
  action: 'deleted',
};

const MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK = {
  action: 'triggered',
  data: {event: EVENT},
  installation: INSTALLATION,
};

const MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK_WITH_ALERT_RULE_ACTION = {
  action: 'triggered',
  data: {event: EVENT, issue_alert: ISSUE_ALERT_WITH_ALERT_RULE_ACTION},
  installation: INSTALLATION,
};

const MOCK_BASE_METRIC_ALERT_WEBHOOK = {
  data: {
    metric_alert: METRIC_ALERT,
    description_text: METRIC_ALERT_DESCRIPTION,
  },
  installation: INSTALLATION,
};

const MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION = {
  data: {
    metric_alert: METRIC_ALERT_WITH_ALERT_RULE_ACTION,
    description_text: METRIC_ALERT_DESCRIPTION,
  },
  installation: INSTALLATION,
};

const MOCK_METRIC_ALERT_RESOLVED_WEBHOOK = {
  action: 'resolved',
  ...MOCK_BASE_METRIC_ALERT_WEBHOOK,
};

const MOCK_METRIC_ALERT_WARNING_WEBHOOK = {
  action: 'warning',
  ...MOCK_BASE_METRIC_ALERT_WEBHOOK,
};

const MOCK_METRIC_ALERT_CRITICAL_WEBHOOK = {
  action: 'critical',
  ...MOCK_BASE_METRIC_ALERT_WEBHOOK,
};

const MOCK_METRIC_ALERT_WARNING_WEBHOOK_WITH_ALERT_RULE_ACTION = {
  action: 'warning',
  ...MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION,
};

const MOCK_METRIC_ALERT_CRITICAL_WEBHOOK_WITH_ALERT_RULE_ACTION = {
  action: 'critical',
  ...MOCK_BASE_METRIC_ALERT_WEBHOOK_WITH_ALERT_RULE_ACTION,
};

export const MOCK_WEBHOOK = {
  'installation.deleted': MOCK_INSTALLATION_DELETED_WEBHOOK,
  'installation.created': MOCK_INSTALLATION_CREATED_WEBHOOK,
  'issue.assigned': MOCK_ISSUE_ASSIGNED_WEBHOOK,
  'issue.created': MOCK_ISSUE_CREATED_WEBHOOK,
  'issue.ignored': MOCK_ISSUE_IGNORED_WEBHOOK,
  'issue.resolved': MOCK_ISSUE_RESOLVED_WEBHOOK,
  'comment.created': MOCK_COMMENT_CREATED_WEBHOOK,
  'comment.updated': MOCK_COMMENT_UPDATED_WEBHOOK,
  'comment.deleted': MOCK_COMMENT_DELETED_WEBHOOK,
  'event_alert.triggered': MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK,
  'event_alert.triggered:with_alert_rule_action':
    MOCK_EVENT_ALERT_TRIGGERED_WEBHOOK_WITH_ALERT_RULE_ACTION,
  'metric_alert.resolved': MOCK_METRIC_ALERT_RESOLVED_WEBHOOK,
  'metric_alert.warning': MOCK_METRIC_ALERT_WARNING_WEBHOOK,
  'metric_alert.warning:with_alert_rule_action':
    MOCK_METRIC_ALERT_WARNING_WEBHOOK_WITH_ALERT_RULE_ACTION,
  'metric_alert.critical': MOCK_METRIC_ALERT_CRITICAL_WEBHOOK,
  'metric_alert.critical:with_alert_rule_action':
    MOCK_METRIC_ALERT_CRITICAL_WEBHOOK_WITH_ALERT_RULE_ACTION,
};

export const MOCK_ISSUE_LINK = {
  installationId: UUID,
  fields: {
    title: ISSUE['title'],
    description: 'This is an item description!',
    column: 'DOING',
    complexity: 2,
    itemId: undefined as string,
  },
  issueId: ISSUE['id'],
};

export const MOCK_ALERT_RULE_ACTION = {
  fields: ALERT_RULE_ACTION_SETTINGS,
  installationId: UUID,
};
