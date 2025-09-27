// / <reference types="react" />
// / <reference types="react-dom" />
// / <reference types="@testing-library/jest-dom" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  // Google Analytics
  function gtag(command: string, targetId: string, config?: any): void;
  function gtag(command: string, action: string, parameters?: any): void;
}

export {};
