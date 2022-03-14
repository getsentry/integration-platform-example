import '@emotion/react';

// See: https://emotion.sh/docs/typescript#define-a-theme
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any
  export interface Theme extends Record<string, any> {}
}
