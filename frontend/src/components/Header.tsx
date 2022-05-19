import styled from '@emotion/styled';
import React from 'react';

import ErrorForm from './ErrorForm';

const Header = () => (
  <StyledHeader>
    <Title>🚀 ACME Kanban</Title>
    <ErrorForm />
  </StyledHeader>
);

const StyledHeader = styled.header`
  background: ${p => p.theme.gray100};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3rem;
  font-style: italic;
`;

const Title = styled.h1`
  display: block;
  flex: 1;
  font-size: 1.5rem;
  text-align: left;
  color: ${p => p.theme.blue300};
`;

export default Header;
