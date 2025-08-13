// src/setupTests.js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'node:util';
import { afterEach } from 'vitest'; // 确保导入 afterEach

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent() { return false },
  });
}

// 在每个测试后自动调用 cleanup，这是正确且推荐的做法
afterEach(() => {
  cleanup();
});