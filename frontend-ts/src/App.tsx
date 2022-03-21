import {ThemeProvider} from '@emotion/react';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import KanbanPage from './pages/Kanban';
import SetupPage from './pages/Setup';
import GlobalStyles from './styles/GlobalStyles';
import {lightTheme} from './styles/theme';

function App() {
  // Monitor changes to use the appropriate theme
  const lightThemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const [isLightTheme, setIsLightTheme] = useState(() => lightThemeMediaQuery.matches);
  useEffect(() => {
    const eventListener = (e: MediaQueryListEvent) => setIsLightTheme(e.matches);
    lightThemeMediaQuery.addEventListener('change', eventListener);
    return () => lightThemeMediaQuery.removeEventListener('change', eventListener);
  }, []);
  return (
    // TODO(Leander): Allow dark theme once finalized
    <ThemeProvider theme={isLightTheme ? lightTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<KanbanPage />} />
          <Route path="/setup" element={<SetupPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
