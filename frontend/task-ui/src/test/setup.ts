import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';

// Polyfill for URL constructor in jsdom environment
if (typeof globalThis.URL === 'undefined') {
  const { URL } = await import('url');
  globalThis.URL = URL;
}

// Mock fetch if not available
if (typeof globalThis.fetch === 'undefined') {
  const fetch = await import('node-fetch');
  globalThis.fetch = fetch.default as typeof globalThis.fetch;
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
