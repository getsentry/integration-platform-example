import {ThemeProvider} from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import GlobalStyles from './styles/GlobalStyles';
import {lightTheme} from './styles/theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
