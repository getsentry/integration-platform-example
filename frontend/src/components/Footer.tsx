import styled from '@emotion/styled';
import React from 'react';

import SentryLogo from './SentryLogo';

const Footer = () => (
  <StyledFooter>
    <a
      href="https://docs.sentry.io/product/integrations/integration-platform/"
      className="right"
    >
      Docs
    </a>
    <SentryLogo />
    <a href="https://github.com/getsentry/integration-platform-example">Source Code</a>
  </StyledFooter>
);

const StyledFooter = styled.div`
  background: ${p => p.theme.gray100};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${p => p.theme.gray300};
  svg {
    margin: 0 3rem;
  }
  a {
    flex: 1;
    color: ${p => p.theme.gray300};
    text-decoration: none;
    &.right {
      text-align: right;
    }
  }
`;

export default Footer;
