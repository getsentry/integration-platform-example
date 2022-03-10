import {css, Global, Theme, useTheme} from '@emotion/react';
import React from 'react';

const GlobalCss = (theme: Theme) => css`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: ${theme.text.family};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: ${theme.text.familyMono};
  }
`;

const GlobalStyles = () => {
  const theme = useTheme();
  return <Global styles={GlobalCss(theme)} />;
};

export default GlobalStyles;
