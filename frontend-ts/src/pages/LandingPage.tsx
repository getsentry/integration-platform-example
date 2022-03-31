import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import BasePage from '../components/BasePage';
import Main from '../components/Main';
import {Organization} from '../types';
import {makeBackendRequest} from '../util';

function LandingPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data: Organization[] =
        (await makeBackendRequest('/api/organizations/')) || [];
      setOrganizations(data);
    }
    fetchData();
  }, []);

  return (
    <BasePage>
      <Main>
        <h3>Select an organization to get started:</h3>
        {organizations.map(({id, slug, name}) => (
          <StyledLink key={id} to={`/${slug}`}>
            {name}
          </StyledLink>
        ))}
      </Main>
    </BasePage>
  );
}

const StyledLink = styled(Link)`
  color: ${p => p.theme.purple300};
  font-weight: 600;
  text-decoration: none;
  background: ${p => p.theme.surface100};
  border-radius: 0.5rem;
  display: block;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: box-shadow 0.3s ease;
  box-shadow: 0px 0px 0px ${p => p.theme.purple200};
  &:hover {
    box-shadow: 2px 2px 8px ${p => p.theme.purple200};
  }
`;

export default LandingPage;
