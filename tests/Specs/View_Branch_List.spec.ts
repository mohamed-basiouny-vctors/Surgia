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
    await tenantBranches.waitForLoadingToComplete();

  });

  test('SH1-763: View Branch List - Verify branches table displays branch name, city, and contact (if set)', async ({ page }) => {

    await expect(page.getByText('Branch name')).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Contact name')).toBeVisible();
    await expect(page.getByText('Contact details')).toBeVisible();
    
    // Verify table data is displayed
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Verify at least one branch row exists
    const branchRows = page.locator('table tbody tr');
    await expect(branchRows.first()).toBeVisible();
    
    // Verify branch name column has data
    const branchNameCell = page.locator('table tbody tr td:nth-child(3)').first();
    await expect(branchNameCell).toBeVisible();
    
    // Verify city column has data
    const cityCell = page.locator('table tbody tr td:nth-child(4)').first();
    await expect(cityCell).toBeVisible();
    
    // Verify contact name column has data
    const contactNameCell = page.locator('table tbody tr td:nth-child(7)').first();
    await expect(contactNameCell).toBeVisible();
  });

  test('SH1-765: View Branch List - Verify sorting by branch name (ascending)', async ({ page }) => {
    // Click on branch name header to sort ascending
    const branchNameHeader = page.getByRole('cell', { name: 'Branch name sort' });
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    // Get all branch names from the table
    const branchNames = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    
    // Verify branch names are sorted in ascending order
    const sortedBranchNames = [...branchNames].sort();
    expect(branchNames).toEqual(sortedBranchNames);
  });

  test('SH1-766: View Branch List - Verify sorting by branch name (descending)', async ({ page }) => {
    // Click on branch name header twice to sort descending
    const branchNameHeader = page.getByRole('cell', { name: 'Branch name sort' });
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    await branchNameHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    // Get all branch names from the table
    const branchNames = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    
    // Verify branch names are sorted in descending order
    const sortedBranchNames = [...branchNames].sort().reverse();
    expect(branchNames).toEqual(sortedBranchNames);
  });

  test('SH1-767: View Branch List - Verify sorting by city (ascending)', async ({ page }) => {
    // Click on city header to sort ascending
    const cityHeader = page.getByRole('cell', { name: 'City sort' });
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    // Get all city names from the table
    const cityNames = await page.locator('table tbody tr td:nth-child(4)').allTextContents();
    
    // Verify city names are sorted in ascending order
    const sortedCityNames = [...cityNames].sort();
    expect(cityNames).toEqual(sortedCityNames);
  });

  test('SH1-768: View Branch List - Verify sorting by city (descending)', async ({ page }) => {
    // Click on city header twice to sort descending
    const cityHeader = page.getByRole('cell', { name: 'City sort' });
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    await cityHeader.click();
    await tenantBranches.waitForLoadingToComplete();
    
    // Get all city names from the table
    const cityNames = await page.locator('table tbody tr td:nth-child(4)').allTextContents();
    
    // Verify city names are sorted in descending order
    const sortedCityNames = [...cityNames].sort().reverse();
    expect(cityNames).toEqual(sortedCityNames);
  });

  test('SH1-770: View Branch List - Verify filtering by city', async ({ page }) => {
    // Get the city filter dropdown (All Branches dropdown)
    const cityFilter = page.locator('select').first();
    await expect(cityFilter).toBeVisible();
    
    // Select a specific city from the dropdown
    const firstCityOption = page.locator('select option').nth(1); // Skip "All Branches" option
    const cityValue = await firstCityOption.textContent();
    await cityFilter.selectOption(cityValue);
    await tenantBranches.waitForLoadingToComplete();
    
    // Verify that only branches from the selected city are displayed
    const cityCells = page.locator('table tbody tr td:nth-child(4)');
    const cityCount = await cityCells.count();
    
    if (cityCount > 0) {
      // Check that all visible cities match the selected city
      for (let i = 0; i < cityCount; i++) {
        const cellText = await cityCells.nth(i).textContent();
        expect(cellText).toContain(cityValue);
      }
    }
  });

  test('SH1-771: View Branch List - Verify "All Branches" context shows all branches', async ({ page }) => {
    // Get initial branch count
    const initialBranchCount = await page.locator('table tbody tr').count();
    
    // Select a specific city filter first
    const cityFilter = page.locator('select').first();
    await cityFilter.selectOption({ index: 1 }); // Select first city option
    await tenantBranches.waitForLoadingToComplete();
    
    // Get filtered branch count
    const filteredBranchCount = await page.locator('table tbody tr').count();
    
    // Select "All Branches" option
    await cityFilter.selectOption('All Branches');
    await tenantBranches.waitForLoadingToComplete();
    
    // Get all branches count
    const allBranchesCount = await page.locator('table tbody tr').count();
    
    // Verify that "All Branches" shows more or equal branches than filtered view
    expect(allBranchesCount).toBeGreaterThanOrEqual(filteredBranchCount);
    
    // Verify that "All Branches" shows the initial count
    expect(allBranchesCount).toBeGreaterThanOrEqual(initialBranchCount);
  });

  test('SH1-774: View Branch List - Verify branches table pagination (if applicable)', async ({ page }) => {
    // Check if pagination controls are visible
    const nextButton = page.getByRole('button', { name: 'Next' });
    const previousButton = page.getByRole('button', { name: 'Previous' });
    const pageNumbers = page.locator('button').filter({ hasText: /^\d+$/ });
    
    // If pagination exists, test pagination functionality
    if (await nextButton.isVisible()) {
      // Test Next button
      if (!(await nextButton.isDisabled())) {
        await nextButton.click();
        await tenantBranches.waitForLoadingToComplete();
        
        // Verify page changed (Previous button should be enabled)
        await expect(previousButton).not.toBeDisabled();
      }
      
      // Test Previous button
      if (!(await previousButton.isDisabled())) {
        await previousButton.click();
        await tenantBranches.waitForLoadingToComplete();
        
        // Verify we're back to first page
        await expect(previousButton).toBeDisabled();
      }
      
      // Test page number buttons
      const pageNumberCount = await pageNumbers.count();
      if (pageNumberCount > 1) {
        await pageNumbers.nth(1).click(); // Click second page
        await tenantBranches.waitForLoadingToComplete();
        
        // Verify page changed
        await expect(previousButton).not.toBeDisabled();
      }
    } else {
      // If no pagination, verify that all branches fit on one page
      const branchRows = await page.locator('table tbody tr').count();
      expect(branchRows).toBeGreaterThan(0);
    }
  });

  test('SH1-782: View Branch List - Verify branch contact formatting (if applicable)', async ({ page }) => {
    // Check if contact details column has data
    const contactDetailsCells = page.locator('table tbody tr td:nth-child(8)');
    const contactDetailsCount = await contactDetailsCells.count();
    
    if (contactDetailsCount > 0) {
      // Check first contact details cell
      const firstContactCell = contactDetailsCells.first();
      const contactText = await firstContactCell.textContent();
      
      // Verify contact details are properly formatted
      // This could be email, phone, or other contact info
      if (contactText && contactText.trim() !== '') {
        // Check if it contains email format or phone format
        const hasEmailFormat = /\S+@\S+\.\S+/.test(contactText);
        const hasPhoneFormat = /[\+]?[0-9\s\-\(\)]+/.test(contactText);
        
        // At least one valid format should be present
        expect(hasEmailFormat || hasPhoneFormat).toBeTruthy();
      }
    }
    
    // Verify contact name column formatting
    const contactNameCells = page.locator('table tbody tr td:nth-child(7)');
    const contactNameCount = await contactNameCells.count();
    
    if (contactNameCount > 0) {
      const firstContactNameCell = contactNameCells.first();
      const contactNameText = await firstContactNameCell.textContent();
      
      // Verify contact name is not empty and properly formatted
      if (contactNameText && contactNameText.trim() !== '') {
        expect(contactNameText.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
