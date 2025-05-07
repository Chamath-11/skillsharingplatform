import * as React from 'react';

declare module 'react' {
  // Add any additional React types you need here
  // This file ensures the React namespace is properly recognized
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // This ensures JSX elements are properly recognized
      [elemName: string]: any;
    }
  }
}