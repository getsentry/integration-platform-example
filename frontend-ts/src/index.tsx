import * as Sentry from '@sentry/react';
import React from 'react';
import {render} from 'react-dom';

import App from './App';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
