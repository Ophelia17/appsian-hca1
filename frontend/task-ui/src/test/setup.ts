import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

// Polyfill for URL constructor in jsdom environment
if (typeof globalThis.URL === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { URL } = require('url');
    globalThis.URL = URL;
  } catch {
    // URL polyfill not available, skip
  }
}

// Mock fetch if not available
if (typeof globalThis.fetch === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fetch = require('node-fetch');
    globalThis.fetch = fetch.default || fetch;
  } catch {
    // fetch polyfill not available, skip
  }
}

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
