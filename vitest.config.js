import { defineConfig } from 'vitest/config';

// Vitest runs the unit + API examples only.
// Playwright owns the UI tests (tests/ui/*.spec.js), so we keep Vitest out of there.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js', 'tests/api/**/*.test.js'],
  },
});
