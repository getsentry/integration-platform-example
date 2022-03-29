import styled from '@emotion/styled';
import React, {SyntheticEvent} from 'react';

import ThemedSelect from './ThemedSelect';

const WEBHOOK_OPTIONS = [
  'error.created',
  // TODO(Leander): Implement the following webhook triggers
  // 'issue.created',
  // 'issue.resolved',
  // 'issue.assigned',
  // 'issue.ignored',
  // 'comment.created',
  // 'comment.updated',
  // 'comment.ignored',
];

function WebhookForm() {
  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <StyledSelect
        options={WEBHOOK_OPTIONS.map(webhook => ({value: webhook, label: webhook}))}
      />
      <button type="submit" className="primary">
        Trigger Webhook
      </button>
    </Form>
  );
}

const Form = styled.form`
  margin: 1rem 2rem;
  flex: 1;
  display: flex;
`;

const StyledSelect = styled(ThemedSelect)`
  min-width: 300px;
  font-size: ${p => p.theme.text.baseSize};
`;

export default WebhookForm;
