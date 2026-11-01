import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['testes/unitarios/**/*.test.ts'],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
