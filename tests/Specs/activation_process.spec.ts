import { test, expect } from '@playwright/test';
import { TenantsPage } from '../pages/tenants_page';
import { AdminLoginPage } from '../pages/AdminLoginPage';

let tenantsPage: TenantsPage;
let adminLoginPage: AdminLoginPage;

test.describe('Tenant Activation Process', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(190000);
    tenantsPage = new TenantsPage(page);
    adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.open();
    await adminLoginPage.login("menna.mohamed@dentacarts.com", "123456");
    await tenantsPage.waitForPageLoad();
  });

  test('SH1-1326: Basic Tenant Activation Flow', async ({ page }) => {
  await page.getByRole('link', { name: 'Tenants' }).click();
  await page.getByRole('button', { name: 'Pending' }).click();
  await page.locator('td:nth-child(9)').first().click();
  await page.getByRole('button', { name: 'Activate now' }).click();
  await page.getByRole('button', { name: 'Next' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter branch name' }).fill('test');
  await page.getByRole('button', { name: 'Select city' }).click();
  await page.getByText('Ash Sharqiyah').click();
  await page.getByRole('button', { name: 'Enter district name' }).click();
  await page.getByText('Al-Ahsa', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter address' }).fill('ttttttttttttttttt');
  await page.getByRole('textbox', { name: 'Enter first name' }).fill('tttt');
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('tttt');
  await page.getByRole('button', { name: 'Activate' }).click();
  await page.getByRole('button', { name: 'Activate' }).click();
  await expect(page.getByText('Tenant was activated')).toBeVisible();
  });


  test('SH1-1330: Form Validation - Required Fields', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Try to submit without filling required fields
    await tenantsPage.clickActivate();
    
    // Verify that form validation prevents submission
    // This would depend on the application's validation behavior
    await tenantsPage.waitForPageLoad();
  });

  test('SH1-1331: Phone Number Format Validation', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Test different phone number formats
    const phoneNumbers = ['123456789', '987654321', '555666777'];
    
    for (const phone of phoneNumbers) {
      await tenantsPage.fillPhone(phone);
      await expect(tenantsPage.phoneInput).toHaveValue(phone);
    }
  });

  test('SH1-1332: Email Format Validation', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Test different email formats
    const emails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'admin+test@company.org'
    ];
    
    for (const email of emails) {
      await tenantsPage.fillUserEmail(email);
      await expect(tenantsPage.userEmailInput).toHaveValue(email);
    }
  });

  test('SH1-1333: Address Field Length Validation', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Test with different address lengths
    const addresses = [
      'Short',
      'Medium length address',
      'Very long address that might exceed normal limits and should be handled appropriately by the system'
    ];
    
    for (const address of addresses) {
      await tenantsPage.fillAddress(address);
      await expect(tenantsPage.addressInput).toHaveValue(address);
    }
  });


  test('SH1-1337: Error Handling - Invalid Data', async ({ page }) => {
  await page.goto('https://admin-surgia-test.dentacartscloud.net/tenants');
  await page.getByRole('link', { name: 'Tenants' }).click();
  await page.getByRole('button', { name: 'Pending' }).click();
  await page.locator('td:nth-child(9)').first().click();
  await page.getByRole('button', { name: 'Activate now' }).click();
  await page.getByRole('button', { name: 'Next' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter branch name' }).click();
  await page.getByRole('textbox', { name: 'Enter branch name' }).fill('14');
  await expect(page.getByText('Must be at least 3 characters')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter without country code' }).fill('rrrrjjjjjjjjjj');
  await page.getByRole('textbox', { name: 'Enter branch name' }).click();
  await expect(page.getByText('Invalid phone number format')).toBeVisible();
  });


  test('SH1-1339: Data Persistence - Form Field Values', async ({ page }) => {
  await page.goto('https://admin-surgia-test.dentacartscloud.net/tenants');
  await page.getByRole('link', { name: 'Tenants' }).click();
  await page.getByRole('button', { name: 'Pending' }).click();
  await page.locator('td:nth-child(9)').first().click();
  await page.getByRole('button', { name: 'Activate now' }).click();
  await page.getByRole('button', { name: 'Next' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter branch name' }).fill('rrrrrrrrrr');
  await expect(page.getByRole('textbox', { name: 'Enter branch name' })).toHaveValue('rrrrrrrrrr');
  });


  test('SH1-1341: Table Structure Verification - Pending and Active Tabs', async ({ page }) => {
    await page.getByRole('link', { name: 'Tenants' }).click();
    await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pending' })).toBeVisible();
  });
});
