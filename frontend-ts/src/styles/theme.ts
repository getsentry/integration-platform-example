const baseTheme = {
  text: {
    family: '"Rubik", "Avenir Next", sans-serif',
    familyMono: '"Roboto Mono", Monaco, Consolas, "Courier New", monospace',
    lineHeightHeading: 1.2,
    lineHeightBody: 1.4,
  },
};

export const lightColors = {
  black: '#1D1127',
  white: '#FFFFFF',

  surface100: '#FAF9FB',
  surface200: '#FFFFFF',
  surface300: '#FFFFFF',
  surface400: '#F5F3F7',

  gray500: '#2B2233',
  gray400: '#3E3446',
  gray300: '#80708F',
  gray200: '#DBD6E1',
  gray100: '#EBE6EF',

  translucentGray200: 'rgba(58, 17, 95, 0.18)',
  translucentGray100: 'rgba(45, 0, 85, 0.1)',

  purple400: '#584AC0',
  purple300: '#6C5FC7',
  purple200: 'rgba(108, 95, 199, 0.5)',
  purple100: 'rgba(108, 95, 199, 0.1)',

  blue400: '#2562D4',
  blue300: '#3C74DD',
  blue200: 'rgba(60, 116, 221, 0.5)',
  blue100: 'rgba(60, 116, 221, 0.09)',

  green400: '#268D75',
  green300: '#2BA185',
  green200: 'rgba(43, 161, 133, 0.55)',
  green100: 'rgba(43, 161, 133, 0.13)',

  yellow400: '#E5A500',
  yellow300: '#F5B000',
  yellow200: 'rgba(245, 176, 0, 0.55)',
  yellow100: 'rgba(245, 176, 0, 0.08)',

  red400: '#F32F35',
  red300: '#F55459',
  red200: 'rgba(245, 84, 89, 0.5)',
  red100: 'rgba(245, 84, 89, 0.09)',

  pink400: '#E50675',
  pink300: '#F91A8A',
  pink200: 'rgba(249, 26, 138, 0.5)',
  pink100: 'rgba(249, 26, 138, 0.1)',
};

export const darkColors = {
  black: '#1D1127',
  white: '#FFFFFF',

  surface100: '#1A141F',
  surface200: '#241D2A',
  surface300: '#2C2433',
  surface400: '#362E3E',

  gray500: '#EBE6EF',
  gray400: '#D6D0DC',
  gray300: '#998DA5',
  gray200: '#43384C',
  gray100: '#342B3B',

  /**
   * Alternative version of gray200 that's translucent.
   * Useful for borders on tooltips, popovers, and dialogs.
   */
  translucentGray200: 'rgba(218, 184, 245, 0.18)',
  translucentGray100: 'rgba(208, 168, 240, 0.1)',

  purple400: '#6859CF',
  purple300: '#7669D3',
  purple200: 'rgba(108, 95, 199, 0.6)',
  purple100: 'rgba(118, 105, 211, 0.1)',

  blue400: '#4284FF',
  blue300: '#5C95FF',
  blue200: 'rgba(92, 149, 255, 0.4)',
  blue100: 'rgba(92, 149, 255, 0.1)',

  green400: '#26B593',
  green300: '#2AC8A3',
  green200: 'rgba(42, 200, 163, 0.4)',
  green100: 'rgba(42, 200, 163, 0.1)',

  yellow400: '#F5B000',
  yellow300: '#FFC227',
  yellow200: 'rgba(255, 194, 39, 0.35)',
  yellow100: 'rgba(255, 194, 39, 0.07)',

  red400: '#FA2E34',
  red300: '#FA4F54',
  red200: 'rgba(250, 79, 84, 0.4)',
  red100: 'rgba(250, 79, 84, 0.1)',

  pink400: '#C4317A',
  pink300: '#D1478C',
  pink200: 'rgba(209, 71, 140, 0.55)',
  pink100: 'rgba(209, 71, 140, 0.13)',
};

const darkTheme = {...baseTheme, ...darkColors, inverted: {...lightColors}};
const lightTheme = {...baseTheme, ...lightColors, inverted: {...darkColors}};

export {darkTheme, lightTheme};
