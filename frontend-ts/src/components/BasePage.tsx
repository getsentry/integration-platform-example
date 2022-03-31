import styled from '@emotion/styled';
import React from 'react';

import Footer from '../components/Footer';

function BasePage({children}: {children: React.ReactNode}) {
  return (
    <BasePageWrapper>
      <Layout>{children}</Layout>
      <Footer />
    </BasePageWrapper>
  );
}

const BasePageWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const Layout = styled.div`
  flex: 1;
`;

export default BasePage;
