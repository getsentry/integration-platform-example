import {css, Global, Theme, useTheme} from '@emotion/react';
import React from 'react';

const GlobalCss = (theme: Theme) => css`
  * {
    box-sizing: border-box;
  }
  html,
  body {
    margin: 0;
    font-family: ${theme.text.family};
    font-size: ${theme.text.baseSize};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.inverted.surface100};
    background: ${theme.surface100};
    height: 100%;
  }
  #root {
    height: 100%;
  }
  code {
    font-family: ${theme.text.familyMono};
  }
  button {
    outline: 0;
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 1000px;
    margin: 0 0.5rem;
    background: ${theme.gray200};
    cursor: pointer;
    &.primary {
      background: ${theme.purple300};
      font-weight: bold;
      color: ${theme.surface100};
    }
    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
  option {
    outline: 0;
    padding: 0.5rem 1rem;
    border: 0;
  }
`;

const GlobalStyles = () => {
  const theme = useTheme();
  return <Global styles={GlobalCss(theme)} />;
};

export default GlobalStyles;
