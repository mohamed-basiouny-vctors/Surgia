import { test, expect } from '@playwright/test';
import { Tenant_Branches } from '../pages/Tenant_Branches';
import { Loginadmin } from '../pages/Tenantsigninpage';

let tenantBranches: Tenant_Branches;
let tenantLogin: Loginadmin;

test.describe('View Branch List - Tenant Portal', () => {
  test.beforeEach(async ({ page }) => {
    tenantBranches = new Tenant_Branches(page);
    tenantLogin = new Loginadmin(page);
    await tenantLogin.open();
    await tenantLogin.loginWithDefault();
    await page.getByRole('link', { name: 'Branches' }).click();
    test.setTimeout(19000);
  });

  test('SH1-763: View Branch List - Verify branches table displays branch name, city, and contact (if set)', async ({ page }) => {
    await expect(page.getByText('Branch name')).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Contact name')).toBeVisible();
    await expect(page.getByText('Contact details')).toBeVisible();
    
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    const branchRows = page.locator('table tbody tr');
    await expect(branchRows.first()).toBeVisible();
    
    const branchNameCell = page.locator('table tbody tr td:nth-child(3)').first();
    await expect(branchNameCell).toBeVisible();
    
    const cityCell = page.locator('table tbody tr td:nth-child(4)').first();
    await expect(cityCell).toBeVisible();
    
    const contactNameCell = page.locator('table tbody tr td:nth-child(7)').first();
    await expect(contactNameCell).toBeVisible();
  });

  test('SH1-765: View Branch List - Verify sorting by branch name (ascending)', async ({ page }) => {
    const branchNameHeader = page.getByRole('cell', { name: 'Branch name sort' });
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    const branchNames = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    
    const sortedBranchNames = [...branchNames].sort();
    expect(branchNames).toEqual(sortedBranchNames);
  });

  test('SH1-766: View Branch List - Verify sorting by branch name (descending)', async ({ page }) => {
    const branchNameHeader = page.getByRole('cell', { name: 'Branch name sort' });
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    const branchNames = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    
    const sortedBranchNames = [...branchNames].sort().reverse();
    expect(branchNames).toEqual(sortedBranchNames);
  });

  test('SH1-767: View Branch List - Verify sorting by city (ascending)', async ({ page }) => {
    const cityHeader = page.getByRole('cell', { name: 'City sort' });
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    const cityNames = await page.locator('table tbody tr td:nth-child(4)').allTextContents();
    
    const sortedCityNames = [...cityNames].sort();
    expect(cityNames).toEqual(sortedCityNames);
  });

  test('SH1-768: View Branch List - Verify sorting by city (descending)', async ({ page }) => {
    const cityHeader = page.getByRole('cell', { name: 'City sort' });
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    const cityNames = await page.locator('table tbody tr td:nth-child(4)').allTextContents();
    
    const sortedCityNames = [...cityNames].sort().reverse();
    expect(cityNames).toEqual(sortedCityNames);
  });

  test('SH1-770: View Branch List - Verify filtering by city', async ({ page }) => {
    const cityFilter = page.locator('select').first();
    await expect(cityFilter).toBeVisible();
    
    const firstCityOption = page.locator('select option').nth(1);
    const cityValue = await firstCityOption.textContent();
    await cityFilter.selectOption(cityValue);
    await tenantBranches.waitForLoadingToComplete();
    
    const cityCells = page.locator('table tbody tr td:nth-child(4)');
    const cityCount = await cityCells.count();
    
    if (cityCount > 0) {
      for (let i = 0; i < cityCount; i++) {
        const cellText = await cityCells.nth(i).textContent();
        expect(cellText).toContain(cityValue);
      }
    }
  });

  test('SH1-771: View Branch List - Verify "All Branches" context shows all branches', async ({ page }) => {
    const initialBranchCount = await page.locator('table tbody tr').count();
    
    const cityFilter = page.locator('select').first();
    await cityFilter.selectOption({ index: 1 });
    
    const filteredBranchCount = await page.locator('table tbody tr').count();
    
    await cityFilter.selectOption('All Branches');
    await tenantBranches.waitForLoadingToComplete();
    
    const allBranchesCount = await page.locator('table tbody tr').count();
    
    expect(allBranchesCount).toBeGreaterThanOrEqual(filteredBranchCount);
    expect(allBranchesCount).toBeGreaterThanOrEqual(initialBranchCount);
  });

  test('SH1-774: View Branch List - Verify branches table pagination (if applicable)', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: 'Next' });
    const previousButton = page.getByRole('button', { name: 'Previous' });
    const pageNumbers = page.locator('button').filter({ hasText: /^\d+$/ });
    
    if (await nextButton.isVisible()) {
      if (!(await nextButton.isDisabled())) {
        await nextButton.click();
        await tenantBranches.waitForLoadingToComplete();
        await expect(previousButton).not.toBeDisabled();
      }
      
      if (!(await previousButton.isDisabled())) {
        await previousButton.click();
        await tenantBranches.waitForLoadingToComplete();
        await expect(previousButton).toBeDisabled();
      }
      
      const pageNumberCount = await pageNumbers.count();
      if (pageNumberCount > 1) {
        await pageNumbers.nth(1).click();
        await tenantBranches.waitForLoadingToComplete();
        await expect(previousButton).not.toBeDisabled();
      }
    } else {
      const branchRows = await page.locator('table tbody tr').count();
      expect(branchRows).toBeGreaterThan(0);
    }
  });

  test('SH1-782: View Branch List - Verify branch contact formatting (if applicable)', async ({ page }) => {
    const contactDetailsCells = page.locator('table tbody tr td:nth-child(8)');
    const contactDetailsCount = await contactDetailsCells.count();
    
    if (contactDetailsCount > 0) {
      const firstContactCell = contactDetailsCells.first();
      const contactText = await firstContactCell.textContent();
      
      if (contactText && contactText.trim() !== '') {
        const hasEmailFormat = /\S+@\S+\.\S+/.test(contactText);
        const hasPhoneFormat = /[\+]?[0-9\s\-\(\)]+/.test(contactText);
        expect(hasEmailFormat || hasPhoneFormat).toBeTruthy();
      }
    }
    
    const contactNameCells = page.locator('table tbody tr td:nth-child(7)');
    const contactNameCount = await contactNameCells.count();
    
    if (contactNameCount > 0) {
      const firstContactNameCell = contactNameCells.first();
      const contactNameText = await firstContactNameCell.textContent();
      
      if (contactNameText && contactNameText.trim() !== '') {
        expect(contactNameText.trim().length).toBeGreaterThan(0);
      }
    }
  });
});