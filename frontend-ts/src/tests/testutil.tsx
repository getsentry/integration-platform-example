import {ThemeProvider} from '@emotion/react';
import {render} from '@testing-library/react';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import GlobalStyles from '../styles/GlobalStyles';
import {lightTheme} from '../styles/theme';
import * as util from '../util';

export function renderWrapped(Component: React.ReactElement) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <Router>{Component}</Router>
    </ThemeProvider>
  );
}

export function getMockBackend() {
  return jest.spyOn(util, 'makeBackendRequest');
}
