import styled from '@emotion/styled';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

import BasePage from '../components/BasePage';
import Button from '../components/Button';
import Main from '../components/Main';
import SentryLogo from '../components/SentryLogo';
import ThemedSelect from '../components/ThemedSelect';
import {Organization} from '../types';
import {makeBackendRequest} from '../util';

const REDIRECT_TIMEOUT = 3 * 1000;

function SetupPage() {
  const [organizationId, setOrganizationId] = useState(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [redirect, setRedirect] = useState('');
  useEffect(() => {
    async function fetchData() {
      const data: Organization[] =
        (await makeBackendRequest('/api/organizations/')) || [];
      setOrganizations(data);
    }
    fetchData();
  }, []);
  const [searchParams] = useSearchParams();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const payload = {
      code: searchParams.get('code'),
      installationId: searchParams.get('installationId'),
      sentryOrgSlug: searchParams.get('orgSlug'),
      organizationId,
    };
    const {redirectUrl} = await makeBackendRequest('/api/sentry/setup/', payload, {
      method: 'POST',
    });
    setRedirect(redirectUrl);
    setTimeout(() => (window.location = redirectUrl), REDIRECT_TIMEOUT);
  }

  return (
    <BasePage>
      <Main>
        <form onSubmit={handleSubmit}>
          <SentryApplicationLogo size={30} />
          {redirect ? (
            <React.Fragment>
              <h2>You&apos;ve successfully linked YOUR_APP and Sentry!</h2>
              <p>You should be redirected in a few seconds.</p>
              <a href={redirect} data-testid="direct-link">
                Take me back to Sentry
              </a>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <PreInstallTextBlock />
              <OrganizationSelectFieldWrapper>
                <SentryLogo size={20} />
                <h4>{searchParams.get('orgSlug')}</h4>
                <span>&gt;</span>
                <StyledSelect
                  options={organizations.map(({id, name}) => ({
                    value: `${id}`,
                    label: name,
                  }))}
                  onChange={({value}) => setOrganizationId(value)}
                  placeholder="Select an Organization..."
                />
              </OrganizationSelectFieldWrapper>
              <Button type="submit" className="primary" disabled={!organizationId}>
                Submit
              </Button>
            </React.Fragment>
          )}
        </form>
      </Main>
    </BasePage>
  );
}
export const SentryApplicationLogo = styled(SentryLogo)`
  color: ${p => p.theme.surface100};
  margin: 0 auto;
  display: block;
  background: ${p => p.theme.gray300};
  box-sizing: content-box;
  padding: 1rem;
  border-radius: 1rem;
`;

const OrganizationSelectFieldWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 1rem;
  svg {
    min-width: 20px;
  }
  h4 {
    margin: 1rem;
    text-align: right;
  }
  & span {
    flex: 0;
  }
`;

const StyledSelect = styled(ThemedSelect)`
  flex: 1;
  margin: 1rem;
  font-size: ${p => p.theme.text.baseSize};
  * {
    white-space: normal !important;
  }
`;

const PreInstallTextBlock = () => (
  <React.Fragment>
    <h2>Complete your integration of Sentry with YOUR_APP!</h2>
    <p>
      By completing this installation, you&apos;ll gain access to the following features:
    </p>
    <h3>Webhooks</h3>
    <ul>
      <li>Track error/issue volume in Sentry</li>
      <li>Sync the comments/discussion happening in Sentry</li>
      <li>Do fancy stuff when Sentry events fire</li>
    </ul>
    <h3>Issue Linking and Alerting</h3>
    <ul>
      <li>Associate tickets with issues in Sentry</li>
      <li>Create tickets directly from Sentry</li>
      <li>Trigger notifications from alert rules in Sentry</li>
    </ul>
    <h3>Miscellaneous</h3>
    <ul>
      <li>
        Link directly to your code with <b>Stacktrace Linking</b>
      </li>
      <li>
        Access <b>Sentry&apos;s API</b> to do even more goodies
      </li>
    </ul>
    <hr />
    <p>Please choose an organization with which to associate your Sentry installation:</p>
  </React.Fragment>
);

export default SetupPage;
