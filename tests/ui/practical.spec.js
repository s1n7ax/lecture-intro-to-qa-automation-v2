import { test, expect } from '@playwright/test';

// ┌─────────────────────────────────────────────────────────────────────┐
// │  YOUR TURN (≈5 min)                                                   │
// │                                                                       │
// │  The demo tested a VALID login. Now test an INVALID one.              │
// │  This is "negative testing": proving the app rejects bad input.       │
// │                                                                       │
// │  Run it with:   npm run test:ui                                       │
// │  Stuck? The full answer is in  solutions/practical.solution.spec.js   │
// └─────────────────────────────────────────────────────────────────────┘

test('invalid login shows an error', async ({ page }) => {
  await page.goto('/login');

  // 1. Fill in a WRONG username and any password.
  //    (look at how login.spec.js used page.fill('#username', ...) )
  // TODO: fill '#username' with 'wronguser'
  // TODO: fill '#password' with 'wrongpass'

  // 2. Click the submit button.
  // TODO: click 'button[type="submit"]'

  // 3. Assert the red error banner appears.
  //    The site shows the text:  "Your username is invalid!"
  //    Replace the line below with a real assertion on '#flash'.
  await expect(page.locator('#flash')).toContainText('CHANGE ME');
});
