import styled from '@emotion/styled';
import React, {SyntheticEvent, useState} from 'react';

import {triggerError} from '../util';
import Button from './Button';

function ErrorForm() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Test Error #1');

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setIsFormDisabled(true);
    await triggerError(errorMessage);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        onChange={e => setErrorMessage(e.target.value)}
        value={errorMessage}
        disabled={isFormDisabled}
      />
      <Button type="submit" className="primary" disabled={isFormDisabled}>
        {isFormDisabled ? 'Sent!' : 'Send Error to Sentry'}
      </Button>
    </Form>
  );
}

const Form = styled.form`
  margin: 1rem 2rem;
  flex: 1;
  display: flex;
`;

const Input = styled.input`
  border: 1px solid ${p => p.theme.gray200};
  border-radius: 3px;
`;

export default ErrorForm;
