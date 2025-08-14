import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'node:util';
import { afterEach } from 'vitest';

// Polyfill for TextEncoder if it's not available in the global scope.
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
// Polyfill for TextDecoder if it's not available in the global scope.
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Mock implementation of the ResizeObserver API for test environments like JSDOM.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// Assign the mock only if the real ResizeObserver is not present.
if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;

// Mock implementation of the window.matchMedia API, often used for responsive design checks.
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false, // Default to not matching any media query.
    media: '',
    addEventListener() {},
    removeEventListener() {},
    addListener() {}, // Deprecated but included for compatibility.
    removeListener() {}, // Deprecated but included for compatibility.
    onchange: null,
    dispatchEvent() { return false },
  });
}

// Global hook (from Jest/Vitest) that runs after each test.
afterEach(() => {
  // Cleans up the DOM to ensure test isolation.
  cleanup();
});