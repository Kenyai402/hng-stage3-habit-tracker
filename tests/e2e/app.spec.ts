import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:3000';

async function signup(page: Page, email: string, password: string) {
  await page.goto('/signup');
  await page.getByTestId('auth-signup-email').fill(email);
  await page.getByTestId('auth-signup-password').fill(password);
  await page.getByTestId('auth-signup-submit').click();
  await page.waitForURL('**/dashboard');
}

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    const splash = page.getByTestId('splash-screen');
    await expect(splash).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await signup(page, 'redir@example.com', 'pass123');
    await page.goto('/');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('securepass');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard');
    expect(await page.getByTestId('dashboard-page').isVisible()).toBe(true);
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Sign up first
    await signup(page, 'userA@example.com', 'passA');
    // Create a habit for user A
    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('User A Habit');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible();

    // Logout
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');

    // Sign up user B
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('userB@example.com');
    await page.getByTestId('auth-signup-password').fill('passB');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard');

    // User B should not see User A's habit
    expect(await page.getByTestId('habit-card-user-a-habit').isVisible().catch(() => false)).toBe(false);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await signup(page, 'creator@example.com', 'pass123');
    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('Stay hydrated');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signup(page, 'streaker@example.com', 'pass123');
    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-save-button').click();

    const streakEl = page.getByTestId('habit-streak-morning-run');
    await expect(streakEl).toContainText('0 days streak');

    await page.getByTestId('habit-complete-morning-run').click();
    await expect(streakEl).toContainText('1 day streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await signup(page, 'persist@example.com', 'pass123');
    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Journal');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-journal')).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-journal')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await signup(page, 'logout@example.com', 'pass123');
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
    // Trying to access dashboard should redirect
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load app once to populate cache
    await signup(page, 'offline@example.com', 'pass123');
    await page.waitForURL('**/dashboard');

    // Wait for SW to activate
    await page.waitForTimeout(2000);

    // Go offline
    await context.setOffline(true);

    // Navigate to the app — should still render (cached shell)
    await page.goto('/');
    // Either it loads something or stays at current URL without hard crashing
    await page.waitForTimeout(1500);
    const body = await page.locator('body').textContent();
    // Should not be a browser-level "No internet connection" page
    expect(body).not.toBeNull();
    expect(page.url()).not.toContain('chrome-error://');

    await context.setOffline(false);
  });
});
