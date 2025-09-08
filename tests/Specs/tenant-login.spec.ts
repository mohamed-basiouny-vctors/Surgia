import { test, expect } from '@playwright/test';
import { Loginadmin } from '../pages/Tenant_signin_page';

let loginPage: Loginadmin;

test.describe('Tenant Login', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new Loginadmin(page);
    await loginPage.open();
  });

  test('Verify login with spaces in email', async () => {
    await loginPage.login(' dem o@mailna.co ', '123456');
    await expect(loginPage.invalidemailMessage).toBeVisible();
  });

  test('Verify login fails with incorrect email format', async () => {
    await loginPage.login('notanemail.com', '123456');
    await expect(loginPage.invalidemailMessage).toBeVisible();
  });

  test('Verify login fails with both fields empty', async () => {
    await loginPage.login('', '');
    await expect(loginPage.sign_in_button).toBeDisabled();
  });

  test('Verify login fails with empty password field', async () => {
    await loginPage.login('demo@mailna.co', '');
    await expect(loginPage.sign_in_button).toBeDisabled();
  });

  test('Verify login fails with empty email field', async () => {
    await loginPage.login('', '123456');
    await expect(loginPage.sign_in_button).toBeDisabled();
  });

  test('Verify login fails with invalid password', async () => {
    await loginPage.login('demo@mailna.co', '123456+');
    await loginPage.sign_in_button.click();
    await loginPage.assertInvalidLoginMessageIsVisible();
    await expect(loginPage.page).toHaveURL(loginPage.url);
  });

  test('Verify login fails with invalid email', async () => {
    await loginPage.login('invalid@mailna.co', '123456');
    await loginPage.sign_in_button.click();
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify successful login with valid email and password', async () => {
    await loginPage.loginWithDefault();
    await loginPage.sign_in_button.click();
    await expect(loginPage.page).toHaveURL('https://hub-surgia-tst.dentacartscloud.net/en/dashboard');
  });

  test('SH1-667 Verify login with special characters in password', async () => {
    await loginPage.login('demo@mailna.co', '123456');
    await loginPage.sign_in_button.click();
    await expect(loginPage.page).toHaveURL('https://hub-surgia-tst.dentacartscloud.net/en/dashboard');
  });

  test('SH1-652 Verify password field masks input', async () => {
    const inputType = await loginPage.pass_admin.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('SH1-651 Verify login page UI elements (labels, buttons, fields)', async () => {
    await expect(loginPage.username_admin).toBeVisible();
    await expect(loginPage.pass_admin).toBeVisible();
    await expect(loginPage.sign_in_button).toBeVisible();
    await expect(loginPage.emailLabel).toBeVisible();
    await expect(loginPage.passwordLabel).toBeVisible();
  });
});
