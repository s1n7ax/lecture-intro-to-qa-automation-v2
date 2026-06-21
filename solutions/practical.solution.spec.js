import { test, expect } from '@playwright/test';

// SOLUTION to the practical in tests/ui/practical.spec.js
//
// This file lives OUTSIDE testDir (tests/ui), so `npm run test:ui` does NOT run it
// (your practical stays the thing you run). To check the answer, copy this file over
// tests/ui/practical.spec.js and run `npm run test:ui`.

test('invalid login shows an error', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#username', 'wronguser');
  await page.fill('#password', 'wrongpass');
  await page.click('button[type="submit"]');

  // We stay on /login and a red banner reports the bad username.
  await expect(page.locator('#flash')).toContainText('Your username is invalid!');
});
