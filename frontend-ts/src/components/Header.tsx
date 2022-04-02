import styled from '@emotion/styled';
import React from 'react';

import ErrorForm from './ErrorForm';

const Header = () => (
  <StyledHeader>
    <ErrorForm />
  </StyledHeader>
);

const StyledHeader = styled.header`
  background: ${p => p.theme.gray100};
  display: flex;
  justify-content: space-between;
  flex: 0 1 auto;
`;

export default Header;
