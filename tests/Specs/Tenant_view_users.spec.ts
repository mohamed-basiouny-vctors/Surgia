import { test, expect } from '@playwright/test';
import { Tenant_Users } from '../pages/Tenant_Users';
import { Loginadmin } from '../pages/Tenantsigninpage';

let tenantUsers: Tenant_Users;
let tenantLogin: Loginadmin;

test.describe('View&Navigate User List', () => {
  test.beforeEach(async ({ page }) => {
    tenantUsers = new Tenant_Users(page);
    tenantLogin = new Loginadmin(page);
    await tenantLogin.open();
    await tenantLogin.loginWithDefault();
    await tenantUsers.navigateToUsers();
  });

  test('SH1-699: View&Navigate User List - Verify user list display', async ({ page }) => {
    await page.getByRole('combobox').selectOption('499,500,501,502,505,506,508,522,523,524,527,528,529,530,531,532,533,559,560,561,562,563,582,583,585,586,587,588,589,590,591,594,597,598,599,603,604,605,606,607,608,609,610,611,612,613,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,642,643,644,645,646,647,648,649,650,651,652,656,659,660,661,662,663,664,672,673,674,675,676,677,678,679,680,683,684,685,686,687,688,689,690,691,692,693,694,695,699,700,701,702,703,704,705,706,707,708,709,710,711,713,714,715,718,719,721');
    await expect(page.getByRole('cell', { name: 'ID sort' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'User name sort' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'User details' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Roles sort' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Date Created sort' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Status sort' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Last Login sort' })).toBeVisible();
    await expect(page.locator('td:nth-child(8)').first()).toBeVisible();
  });

  test('SH1-700: View&Navigate User List - Verify pagination on large lists', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: '2' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3' })).toBeVisible();
  await page.getByRole('button', { name: '2' }).click();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
  });

  test('SH1-701: View&Navigate User List - Verify search functionality', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('new new');
    await expect(page.getByRole('cell', { name: 'new new' })).toBeVisible();
  });

  test('SH1-702: View&Navigate User List - Verify sort by name', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'User name sort' }).getByRole('img')).toBeVisible();
    await page.getByRole('cell', { name: 'User name sort' }).click();
  });

  test('SH1-703: View&Navigate User List - Verify sort by role', async ({ page }) => {
    await page.getByRole('cell', { name: 'Roles sort' }).click();
  await expect(page.getByRole('cell', { name: 'Roles sort' }).getByRole('img')).toBeVisible();
  });

  test('SH1-704: View&Navigate User List - Verify filter by status', async ({ page }) => {
    await page.getByRole('button', { name: 'Pending' }).click();
    await expect(page.getByRole('row', { name: 'eye 45418 mmmsfsfs@yahoo.com' }).locator('span').nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByRole('row', { name: 'eye 45385 dfgfdg dfgfdg' }).locator('span').nth(3)).toBeVisible();
  });

  test('SH1-706: View&Navigate User List - Verify branch filter functionality', async ({ page }) => {
    await page.getByRole('combobox').selectOption('499');
  await page.getByRole('combobox').selectOption('500');
  await page.getByRole('combobox').selectOption('501');
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByRole('combobox')).toHaveValue('501');
  });

  test('SH1-711: View&Navigate User List - Verify search with no matching users', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('ooooooooooooooo');
    await expect(page.getByText('No Data found')).toBeVisible();

  });

  test('SH1-720: View&Navigate User List - Verify the appearance of the \'No users\' message', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('ooooooooooooooo');
    await expect(page.getByText('No Data found')).toBeVisible();
  });
});

