import {screen} from '@testing-library/react';
import React from 'react';

import KanbanPage from '../pages/KanbanPage';
import {renderWrapped} from './testutil';

describe('KanbanPage', () => {
  test('renders key elements', () => {
    renderWrapped(<KanbanPage />);
    // Columns
    expect(screen.getByText(/todo/i)).toBeInTheDocument();
    expect(screen.getByText(/doing/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
    // Webhooks
    expect(screen.getByText(/trigger webhook/i)).toBeInTheDocument();
    // Footer
    expect(screen.getByText(/docs/i)).toBeInTheDocument();
    expect(screen.getByText(/source code/i)).toBeInTheDocument();
  });
});
