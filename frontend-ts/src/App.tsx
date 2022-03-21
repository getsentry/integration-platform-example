import {ThemeProvider} from '@emotion/react';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import KanbanPage from './pages/Kanban';
import SetupPage from './pages/Setup';
import GlobalStyles from './styles/GlobalStyles';
import {lightTheme} from './styles/theme';

function App() {
  const lightThemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  return (
    // TODO(Leander): Allow dark theme once finalized
    <ThemeProvider theme={lightThemeMediaQuery.matches ? lightTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<KanbanPage />} />
          <Route path="/sentry/setup" element={<SetupPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
