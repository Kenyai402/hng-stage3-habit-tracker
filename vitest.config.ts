import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**'],
      reporter: ['text', 'json', 'html'],
      thresholds: { lines: 80 },
    },
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
});
