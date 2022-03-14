import styled from '@emotion/styled';
import React from 'react';
import Select from 'react-select';

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

const WebhookForm = () => (
  <Form onSubmit={e => e.preventDefault()}>
    <StyledSelect
      options={WEBHOOK_OPTIONS.map(webhook => ({value: webhook, label: webhook}))}
    />
    <button type="submit" className="primary">
      Trigger Webhook
    </button>
  </Form>
);

const Form = styled.form`
  margin: 1rem 2rem;
  flex: 1;
  display: flex;
`;
const StyledSelect = styled(Select)`
  border-radius: 1000px;
  display: inline-block;
  min-width: 300px;
  font-size: ${p => p.theme.text.baseSize};
`;

export default WebhookForm;
