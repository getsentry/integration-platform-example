import styled from '@emotion/styled';
import React from 'react';
import Select from 'react-select';

const webhookOptions = [
  {value: 'error.created', label: 'error.created'},
  {value: 'issue.created', label: 'issue.created'},
  {value: 'issue.resolved', label: 'issue.resolved'},
  {value: 'issue.assigned', label: 'issue.assigned'},
  {value: 'issue.ignored', label: 'issue.ignored'},
  {value: 'comment.created', label: 'comment.created'},
  {value: 'comment.updated', label: 'comment.updated'},
  {value: 'comment.ignored', label: 'comment.ignored'},
];

const WebhookForm = () => (
  <Form>
    <StyledSelect options={webhookOptions} />
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
