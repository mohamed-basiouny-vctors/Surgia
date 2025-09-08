import { test, expect } from '@playwright/test';
import { Tenant_Users } from '../pages/Tenant_Users';
import { Loginadmin } from '../pages/Tenantsigninpage';

let tenantUsers: Tenant_Users;
let tenantLogin: Loginadmin;

test.describe('Tenant Create and Assign Users', () => {
  test.beforeEach(async ({ page }) => {
    tenantUsers = new Tenant_Users(page);
    tenantLogin = new Loginadmin(page);
    await tenantLogin.open();
    await tenantLogin.loginWithDefault();
    await tenantUsers.navigateToUsers();
  });

  test('SH1-561: tenant Create and Assign Users - Verify Tenant Admin can invite users via email', async ({ page }) => {
  
      const testEmail = `testuser${Date.now()}@example.com`;
      await page.getByRole('button', { name: 'Start Icon Add User' }).click();
      await page.getByRole('textbox', { name: 'Enter user email' }).click();
      await page.getByRole('textbox', { name: 'Enter user email' }).fill(testEmail);
      await page.getByRole('button', { name: 'Select user role' }).click();
      await page.locator('div').filter({ hasText: /^Clinical Operator$/ }).click();
      await page.getByRole('button', { name: 'Clinical Operator' }).click();
      await page.getByRole('button', { name: 'Select Branch' }).click();
      await page.locator('div').filter({ hasText: /^branch$/ }).click();
      await page.getByRole('button', { name: 'branch' }).click();
      await page.getByRole('button', { name: 'Send invitation' }).click();
      await expect(page.getByText('Failed to send invitation')).not.toBeVisible();

    });

  test('SH1-565: tenant Create and Assign Users - Verify branch access assignment (single branch)', async ({ page }) => {
      await page.getByRole('combobox').selectOption('501');
      await expect(page.getByRole('combobox')).toBeVisible();
    
  });

  test('SH1-566: tenant Create and Assign Users - Verify branch access assignment (multiple branches)', async ({ page }) => {
    await page.getByRole('combobox').selectOption('499');
    await expect(page.getByRole('combobox')).toBeVisible();
    await page.getByRole('combobox').selectOption('500');
    await expect(page.getByRole('combobox')).toHaveValue('500');
  });
  test('SH1-572: tenant Create and Assign Users - Verify error when inviting duplicate email', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Icon Add User' }).click();
    await page.getByRole('textbox', { name: 'Enter user email' }).click();
    await page.getByRole('textbox', { name: 'Enter user email' }).fill('qqq@qqq.com');
    await page.getByRole('button', { name: 'Select user role' }).click();
    await page.locator('form div').filter({ hasText: /^Clinical Operator$/ }).click();
    await page.getByRole('button', { name: 'Clinical Operator' }).click();
    await page.getByRole('button', { name: 'Select Branch' }).click();
    await page.locator('div').filter({ hasText: /^branch$/ }).click();
    await page.getByRole('button', { name: 'branch' }).click();
    await page.getByRole('button', { name: 'Send invitation' }).click();
    await page.getByRole('button', { name: 'Start Icon Add User' }).click();
    await page.getByRole('textbox', { name: 'Enter user email' }).click();
    await page.getByRole('textbox', { name: 'Enter user email' }).fill('qqq@qqq.com');
    await page.getByRole('button', { name: 'Select user role' }).click();
    await page.locator('form div').filter({ hasText: /^Clinical Operator$/ }).click();
    await page.getByRole('button', { name: 'Clinical Operator' }).click();
    await page.getByRole('button', { name: 'Select Branch' }).click();
    await page.locator('div').filter({ hasText: /^branch$/ }).click();
    await page.getByRole('button', { name: 'branch' }).click();
    await page.getByRole('button', { name: 'Send invitation' }).click();
    await expect(page.getByText('Failed to send invitation')).toBeVisible();
  });

  test('SH1-573: tenant Create and Assign Users - Verify branch access limited to admin\'s accessible branches', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Icon Add User' }).click();
    await page.getByRole('button', { name: 'Select Branch' }).click();
    await expect(page.locator('div').filter({ hasText: /^branch$/ })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^ewwerwer$/ })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^wewerss$/ })).toBeVisible();
  });

  test('SH1-574: tenant Create and Assign Users - Verify user status updates after acceptance', async ({ page }) => {
    await page.getByRole('button', { name: 'Pending' }).click();
    await expect(page.getByRole('row', { name: 'eye 45417 34t34tt@jhdj.dfdf' }).locator('span').nth(1)).toBeVisible();
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Active').nth(2)).toBeVisible();
  });

  
});   

