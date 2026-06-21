import { defineConfig, devices } from '@playwright/test';

// Playwright runs the UI tests against a public practice site.
// testDir is tests/ui so the solution file under solutions/ is NOT run by default.
export default defineConfig({
  testDir: './tests/ui',
  // The site we drive in the demo + practical.
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    // Capture a trace + screenshot when something fails — great for teaching debugging.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
