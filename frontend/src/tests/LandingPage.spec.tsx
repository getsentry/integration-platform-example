import {screen} from '@testing-library/react';
import React from 'react';

import LandingPage from '../pages/LandingPage';
import {getMockBackend, renderWrapped} from './testutil';

const backend = getMockBackend();

const mockOrganizations = [
  {id: 1, name: 'Sentry', slug: 'sentry'},
  {id: 2, name: 'Acme', slug: 'acme'},
];

describe('LandingPage', () => {
  beforeEach(() => {
    // Setup backend query for organization list
    backend.mockResolvedValue(mockOrganizations);
  });
  test('renders key elements', async () => {
    renderWrapped(<LandingPage />);
    // Header
    expect(await screen.findByText(/get started/i)).toBeInTheDocument();
    // List of Organizations
    mockOrganizations.forEach(({slug}) => {
      const orgLink = screen.getByText(new RegExp(slug, 'i'));
      expect(orgLink).toBeInTheDocument();
      expect(orgLink).toHaveAttribute('href', `/${slug}`);
    });
    // Footer
    expect(await screen.findByText(/docs/i)).toBeInTheDocument();
    expect(await screen.findByText(/source code/i)).toBeInTheDocument();
  });
});
