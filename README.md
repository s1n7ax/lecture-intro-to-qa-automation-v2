# Introduction to QA Automation

> **Software QA — Lecture (75 minutes)** · 2nd-year university students
> All automation is written in **JavaScript**. Everything runs in **GitHub Codespaces** — no local setup.

This README **is** the lecture note. Read it top to bottom and you have the whole session: what
automated testing is, the **types** of tests you'll hear about in industry, and three **hands-on**
ways we actually write them — **unit**, **API**, and **UI** tests. At the end there's a short
practical for you to write your own test.

---

## 0. Getting started (do this first)

1. Click **`<> Code` → `Codespaces` → `Create codespace on main`**.
2. Wait ~1–2 minutes. The Codespace automatically runs:
   ```
   npm install && npx playwright install --with-deps chromium
   ```
   so all tools and the browser are ready before you open a terminal. You don't run anything to set up.
3. Open a terminal (`` Ctrl+` ``) and try:
   ```bash
   npm run test:unit
   ```
   If you see green checkmarks, you're ready.

| Command | What it runs |
|---|---|
| `npm run test:unit` | Unit tests (Vitest) — `tests/unit/` |
| `npm run test:api`  | API tests (Vitest + fetch) — `tests/api/` |
| `npm run test:ui`   | UI tests (Playwright) — `tests/ui/` |
| `npm run test:ui:report` | Open the last UI test report (with screenshots/traces) |

---

## 1. What is test automation?

Testing is checking that software does what it should. You can do that **manually** — a human clicks
through the app every release — or you can **automate** it: write code that exercises the app and
**asserts** the result, then run it on demand, in seconds, forever.

Why automate?

- **Speed & repeatability** — hundreds of checks in seconds, the same way every time.
- **Regression safety** — catch the thing you broke today in code that worked yesterday.
- **Runs in CI** — every push can be verified automatically before it ships.

A test, at its core, is always the same shape:

```
ARRANGE  set up the inputs / open the page
ACT      call the function / click the button
ASSERT   check the result is what you expected
```

Everything below is just that pattern at three different **levels** of the application.

---

## 2. Types of tests (theory)

These are the words you'll see in job ads and tickets. They describe **what** you're testing and
**why** — not the tool. Many of them can be automated through the same three interfaces we practise
later (unit / API / UI). Each example below is a real tool doing that kind of test.

| Test type | Purpose | Usually done by |
|---|---|---|
| **Unit** | One function/class in isolation | Developer |
| **Integration** | Several units working together | Developer |
| **Functional** | A feature meets its requirement | QA |
| **Regression** | Old features still work after a change | QA |
| **Smoke** | The build isn't dead on arrival ("does it even start?") | QA |
| **Performance** | Speed/responsiveness under normal use | QA (maybe) |
| **Load** | Behaviour under heavy/concurrent traffic | QA (maybe) |
| **Security** | Vulnerabilities and misuse | Security / QA |
| **Acceptance** | The customer agrees it's what they asked for | Client |
| **End-to-End (E2E)** | A whole user journey across the system | QA |
| **UI** | The interface behaves and looks right | QA |
| **API** | Endpoints honour their contract | QA |
| **Visual regression** | The UI didn't change pixels unexpectedly | QA |

### Examples in the wild

**Unit test** — a developer testing calculator logic (MS Calculator):

![Unit test example](assets/unit-test-example-from-ms-calculator.png)

**Integration test** — components working together (Neovim):

![Integration test example](assets/integration-test-example-from-neovim.png)

**Smoke test** — "does the build even launch?" (VS Code):

![Smoke test example](assets/smoke-test-example-from-vscode.png)

**Performance test** — Chrome Lighthouse scoring a page:

![Performance test example](assets/performance-test-from-chrome-lighthouse-for-google.png)

**Load test** — many simulated users hammering a service:

![Load test example](assets/load-test-example-from-Anton-Putra-youtube.png)

**Security test** — scanning for vulnerabilities (OWASP ZAP):

![Security test example](assets/security-test-example-with-zap.png)

**End-to-End test** — a full user journey (PeerTube):

![E2E test example](assets/e2e-test-example-from-peertube.png)

**UI test** — driving the interface (Meteor):

![UI test example](assets/ui-test-example-from-meteor.png)

**API test** — checking endpoints (json-server):

![API test example](assets/api-test-example-from-jsonplaceholder.png)

**Visual regression test** — diffing screenshots pixel-by-pixel (Resemble.js):

![Visual regression test example](assets/visual-regression-test-example-from-resemblejs.png)

> _Functional_, _regression_, and _acceptance_ testing are about **intent**, not a specific tool —
> any of the tests above can serve those goals depending on what you're checking.

---

## 3. The three interfaces (hands-on)

We'll write automation at three levels, from the simplest/fastest to the most realistic. This is the
**testing pyramid** in miniature: lots of cheap unit tests at the bottom, fewer slow UI tests at the top.

```
        ▲   UI tests        (slow, realistic) ── Playwright
       ╱ ╲  API tests       (fast, backend)   ── fetch + Vitest
      ╱___╲ Unit tests      (instant, logic)  ── Vitest
```

### 3a. Unit testing — `Vitest`

The smallest level: test a **pure function** directly, with no browser and no network. Instant feedback.

The code under test (`src/cart.js`) is a tiny shopping-cart calculator:

```js
export function applyDiscount(amount, percent) {
  if (percent < 0 || percent > 100) {
    throw new Error(`Discount percent must be between 0 and 100, got ${percent}`);
  }
  return amount - amount * (percent / 100);
}
```

The test (`tests/unit/cart.test.js`) asserts how it should behave — including the **error case**:

```js
import { describe, it, expect } from 'vitest';
import { applyDiscount } from '../../src/cart.js';

it('takes the right amount off', () => {
  expect(applyDiscount(100, 20)).toBe(80);
});

it('rejects a discount above 100%', () => {
  expect(() => applyDiscount(100, 150)).toThrow();
});
```

> **🖥️ Demo:** `npm run test:unit` — watch 5 tests pass in milliseconds. Then break `src/cart.js`
> (e.g. change `- amount * ...` to `+ amount * ...`) and rerun to see a test go red and explain exactly
> what was expected vs. received.

**Takeaway:** unit tests are fast and precise — they pinpoint the exact function that's wrong.

### 3b. API testing — `fetch` + `Vitest` + OpenAPI/Swagger

One level up: skip the UI and test the **backend contract** directly over HTTP. We test the public
**[Swagger Petstore](https://petstore.swagger.io/)** API.

APIs describe themselves with an **OpenAPI/Swagger specification** — a machine-readable contract listing
every endpoint, its inputs, and its responses. That same spec powers the **Swagger UI**, where you can
click **"Try it out"** and call the API from your browser.

> **🖥️ Demo:** open **https://petstore.swagger.io/** — show the **Swagger UI**, expand
> `GET /pet/findByStatus`, click **Try it out → Execute**, and point out the request URL and JSON
> response. Then show that our test hits the *same* endpoint in code.

API testing is just sending requests and asserting on the **status code** and **JSON body**
(`tests/api/petstore.test.js`):

```js
it('GET /pet/findByStatus returns a list of available pets (200)', async () => {
  const res = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
  expect(res.status).toBe(200);          // the contract says this should succeed
  const pets = await res.json();
  expect(Array.isArray(pets)).toBe(true);
});
```

We also **create** a pet (`POST`) and read it back, and prove a deleted pet returns **404** (a negative test).

> **🖥️ Demo:** `npm run test:api` — 4 tests hitting a real API over the network.

**Takeaway:** API tests are fast and don't depend on the UI — ideal for checking business logic and contracts.

### 3c. UI testing — `Playwright`

The top level: drive a **real browser** like a user would. We use **[Playwright](https://playwright.dev/)**
against the practice site **[the-internet.herokuapp.com](https://the-internet.herokuapp.com/login)**.

Playwright launches Chromium, performs actions, and **auto-waits** for elements (which makes tests far
less flaky than older tools). The demo logs in successfully (`tests/ui/login.spec.js`):

```js
import { test, expect } from '@playwright/test';

test('valid login lands on the secure area', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
```

> **🖥️ Demo:** `npm run test:ui` to run it, then `npm run test:ui:report` to open the HTML report —
> show the step-by-step trace and the screenshot Playwright captures.

**Takeaway:** UI tests are the most realistic but the slowest — use them for critical user journeys, not everything.

---

## 4. 🙌 Your turn — practical (~5 min)

You've seen a test for a **valid** login. Now write one for an **invalid** login — proving the app
correctly **rejects** bad credentials. This is called **negative testing**.

1. Open **`tests/ui/practical.spec.js`**.
2. Follow the `// TODO` comments:
   - fill `#username` with `wronguser`
   - fill `#password` with `wrongpass`
   - click the submit button
   - assert `#flash` contains the text **`Your username is invalid!`**
3. Run it:
   ```bash
   npm run test:ui
   ```
4. Green? 🎉 You just wrote an automated UI test. Stuck? The answer is in
   `solutions/practical.solution.spec.js` — copy it over `tests/ui/practical.spec.js` and rerun.

**Bonus:** can you also assert that the page is still on `/login` (the user was *not* let in)?

---

## 5. Recap

- A test is always **arrange → act → assert**.
- Test **types** (unit, integration, smoke, performance, security, …) describe *what & why*.
- We automate them through three **interfaces**, trading speed for realism:
  - **Unit** (Vitest) — instant, isolates logic.
  - **API** (fetch + Vitest) — fast, checks the backend contract (described by OpenAPI/Swagger).
  - **UI** (Playwright) — realistic, drives a real browser.
- Prefer **many** unit tests and **few** UI tests (the testing pyramid).

### Go further
- Vitest — https://vitest.dev/
- Playwright — https://playwright.dev/
- Swagger / OpenAPI — https://swagger.io/
- More practice targets — https://the-internet.herokuapp.com/ · https://petstore.swagger.io/

---

### Instructor timing guide (75 min)

| Time | Segment |
|---|---|
| 0:00–0:05 | Codespace open + intro (§0–1) |
| 0:05–0:25 | Test types theory + examples (§2) |
| 0:25–0:35 | Unit demo (§3a) |
| 0:35–0:48 | API demo + Swagger UI (§3b) |
| 0:48–1:00 | UI demo + report (§3c) |
| 1:00–1:10 | Practical: invalid login (§4) |
| 1:10–1:15 | Recap + questions (§5) |
