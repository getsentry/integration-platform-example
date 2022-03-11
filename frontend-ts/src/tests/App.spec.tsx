import {render, screen} from '@testing-library/react';
import React from 'react';

import App from '../App';

test('renders', () => {
  render(<App />);
  expect(screen.getByText(/docs/i)).toBeInTheDocument();
  expect(screen.getByText(/source code/i)).toBeInTheDocument();
});
