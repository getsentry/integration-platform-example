import styled from '@emotion/styled';
import React, {SyntheticEvent, useState} from 'react';

import {triggerError} from '../util';
import Button from './Button';
import ThemedSelect from './ThemedSelect';

// TODO(Leander): Allow the user to specify the type of webhook
const WEBHOOK_LIST = [
  'error.created',
  'issue.created',
  'issue.resolved',
  'issue.assigned',
  'issue.ignored',
  // 'comment.created',
  // 'comment.updated',
  // 'comment.ignored',
];
const WEBHOOK_OPTIONS = WEBHOOK_LIST.map(webhook => ({value: webhook, label: webhook}));

function WebhookForm() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [webhookOption, setWebhookOption] = useState(WEBHOOK_OPTIONS[0]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsFormDisabled(true);
    await triggerError();
    setIsFormDisabled(false);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <StyledSelect
        options={WEBHOOK_OPTIONS}
        onChange={setWebhookOption}
        value={webhookOption}
        isDisabled={true}
      />
      <Button type="submit" className="primary" disabled={isFormDisabled}>
        Trigger Error
      </Button>
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
