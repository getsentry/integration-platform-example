import * as Sentry from '@sentry/react';
import {act, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {when} from 'jest-when';
import React from 'react';

import KanbanPage from '../pages/KanbanPage';
import {getMockBackend, renderWrapped} from './testutil';

const backend = getMockBackend();
const mockItem = {
  title: 'ReferenceError: index is not defined',
  description: 'IPE-E - brokenfile.js',
  complexity: 5,
  column: 'TODO',
  assigneeId: '1',
};
const mockUser = {
  id: '1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.png',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({organizationSlug: 'example'}),
}));

jest.mock('@sentry/react');

describe('KanbanPage', () => {
  beforeEach(() => {
    // Setup backend query for organization list
    when(backend)
      .calledWith('/api/items/?organization=example')
      .mockResolvedValue([mockItem]);
    when(backend)
      .calledWith('/api/users/?organization=example')
      .mockResolvedValue([mockUser]);
  });
  test('renders key elements', async () => {
    renderWrapped(<KanbanPage />);
    // Columns
    expect(await screen.findByText(/todo/i)).toBeInTheDocument();
    expect(await screen.findByText(/doing/i)).toBeInTheDocument();
    expect(await screen.findByText(/done/i)).toBeInTheDocument();
    // Error Form
    const errorButton = await screen.findByText(/Send Error/i);
    expect(errorButton).toBeInTheDocument();
    await act(async () => userEvent.click(errorButton));
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(await screen.findByText(/refresh to send/i)).toBeInTheDocument();
    // Item Cards
    expect(await screen.findByText(mockItem.title)).toBeInTheDocument();
    expect(await screen.findByAltText(mockUser.name)).toBeInTheDocument();
    // Footer
    expect(await screen.findByText(/docs/i)).toBeInTheDocument();
    expect(await screen.findByText(/source code/i)).toBeInTheDocument();
  });
});
