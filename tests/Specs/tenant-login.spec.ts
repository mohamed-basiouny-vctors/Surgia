import { test, expect } from '@playwright/test';
import { Loginadmin } from '../pages/Tenantsigninpage';

let loginPage: Loginadmin;

test.describe('Tenant Login', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(19000);
    loginPage = new Loginadmin(page);
    await expect(async () => {
    await loginPage.open();

    }).toPass();
  });

  test('Verify login with spaces in email', async () => {
    await loginPage.login(' dem o@mailna.co ', '123456');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with incorrect email format', async () => {
    await loginPage.login('notanemail.com', '123456');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with both fields empty', async () => {
    await loginPage.login('', '');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with empty password field', async () => {
    await loginPage.login('demo@mailna.co', '');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with empty email field', async () => {
    await loginPage.login('', '123456');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with invalid password', async () => {
    await loginPage.login('demo@mailna.co', '123456+');
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify login fails with invalid email', async () => {
    await loginPage.login('invalid@mailna.co', '123456');
    await loginPage.sign_in_button.click();
    await loginPage.assertInvalidLoginMessageIsVisible();
  });

  test('Verify successful login with valid email and password', async () => {
    await loginPage.login('new@mailna.co', '123456');
    await expect(loginPage.page).toHaveURL('https://hub-surgia-test.dentacartscloud.net/');
  });

  test('SH1-667 Verify login with special characters in password', async () => {
    await loginPage.sign_in_btn.click();
    await loginPage.username.fill('demo@mailna.co');
    await loginPage.pass.fill('123456*');
    const inputType = await loginPage.pass.inputValue();
    expect(inputType).toEqual('123456*');
  });

  test('SH1-652 Verify password field masks input', async () => {
    await loginPage.sign_in_btn.click();
    await loginPage.username.fill('demo@mailna.co');
    await loginPage.pass.fill('123456');
    const inputType = await loginPage.pass.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('SH1-651 Verify login page UI elements (labels, buttons, fields)', async () => {
    await loginPage.sign_in_btn.click();
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.pass).toBeVisible();
    await expect(loginPage.sign_in_button).toBeVisible();
    await expect(loginPage.emailLabel).toBeVisible();
    await expect(loginPage.passwordLabel).toBeVisible();
  });
});