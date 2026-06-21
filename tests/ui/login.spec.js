import { test, expect } from '@playwright/test';

// UI testing = drive a real browser the way a human would: open a page,
// type, click, and assert on what appears. Playwright launches Chromium,
// performs the actions, and auto-waits for elements so tests are less flaky.

// THE DEMO: a successful login.
test('valid login lands on the secure area', async ({ page }) => {
  // baseURL is set in playwright.config.js, so "/login" is enough.
  await page.goto('/login');

  // These are the credentials the practice site documents on the page.
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  // After a good login the site shows a green flash banner and a /secure URL.
  await expect(page).toHaveURL(/.*secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
