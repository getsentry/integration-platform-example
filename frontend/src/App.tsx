import {ThemeProvider} from '@emotion/react';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import KanbanPage from './pages/KanbanPage';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import GlobalStyles from './styles/GlobalStyles';
import {darkTheme, lightTheme} from './styles/theme';

function App() {
  const lightThemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  return (
    <ThemeProvider theme={lightThemeMediaQuery?.matches ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:organizationSlug" element={<KanbanPage />} />
          <Route path="/sentry/setup" element={<SetupPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
