import {act, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {when} from 'jest-when';
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';

import SetupPage from '../pages/SetupPage';
import {getMockBackend, renderWrapped} from './testutil';

const backend = getMockBackend();

describe('SetupPage', () => {
  beforeEach(() => {
    // Setup query params
    const searchParams = ReactRouterDOM.createSearchParams({
      code: 'abce1233',
      installationId: 'def456',
      orgSlug: 'sentry-example',
    });
    jest
      .spyOn(ReactRouterDOM, 'useSearchParams')
      .mockReturnValue([searchParams, jest.fn()]);
    // Setup backend query for organization list
    when(backend)
      .calledWith('/api/organizations/')
      .mockResolvedValue([{id: 1, name: 'Example Organization'}]);
  });

  test('renders landing page', async () => {
    renderWrapped(<SetupPage isLanding />);
    expect(await screen.findByText(/select an organization/i)).toBeInTheDocument();
    expect(await screen.findByText(/Example Organization/i)).toBeInTheDocument();
  });

  test('renders key elements', async () => {
    renderWrapped(<SetupPage />);
    // Header
    expect(await screen.findByText(/complete your integration/i)).toBeInTheDocument();
    expect(await screen.findByText(/choose an organization/i)).toBeInTheDocument();
    // Form Fields
    expect(await screen.findByText(/select an organization/i)).toBeInTheDocument();
    expect(await screen.findByText(/submit/i)).toBeInTheDocument();
    // Footer
    expect(await screen.findByText(/docs/i)).toBeInTheDocument();
    expect(await screen.findByText(/source code/i)).toBeInTheDocument();
  });

  test('handles submit', async () => {
    renderWrapped(<SetupPage />);
    // Select an organization
    userEvent.click(await screen.findByText(/select an organization/i));
    userEvent.click(await screen.findByText('Example Organization'));
    backend.mockResolvedValueOnce({redirectUrl: 'https://sentry.io'});
    await act(async () => userEvent.click(await screen.findByText(/submit/i)));
    expect(await screen.findByText(/should be redirected/i)).toBeInTheDocument();
    expect(await screen.findByTestId('direct-link')).toBeInTheDocument();
  });
});
