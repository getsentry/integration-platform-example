import {screen} from '@testing-library/react';
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
    // Webhooks
    expect(await screen.findByText(/trigger error/i)).toBeInTheDocument();
    // Item Cards
    expect(await screen.findByText(mockItem.title)).toBeInTheDocument();
    expect(await screen.findByAltText(mockUser.name)).toBeInTheDocument();
    // Footer
    expect(await screen.findByText(/docs/i)).toBeInTheDocument();
    expect(await screen.findByText(/source code/i)).toBeInTheDocument();
  });
});
