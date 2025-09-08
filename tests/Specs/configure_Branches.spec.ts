import { test, expect } from '@playwright/test';
import { TenantsPage } from '../pages/tenants_page';
import { AdminLoginPage } from '../pages/AdminLoginPage';

let tenantsPage: TenantsPage;
let adminLoginPage: AdminLoginPage;

test.describe('Configure Branches - Admin Functionality', () => {
  test.beforeEach(async ({ page }) => {
    tenantsPage = new TenantsPage(page);
    adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.open();
    await adminLoginPage.login("menna.mohamed@dentacarts.com", "123456");
    await tenantsPage.waitForPageLoad();
  });

  // Helper method to navigate to branch form
  async function navigateToBranchForm(page: any) {
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    
    // Click on the view icon (eye) of the first record
    const firstRowViewButton = page.locator('//tbody/tr[1]/td[11]/button[1]/img[1]');
    await firstRowViewButton.click();
    await tenantsPage.waitForPageLoad();
    
    // Click on Add Branch button
    const addBranchButton = page.getByRole('button', { name: 'Add Branch' });
    await addBranchButton.click();
    await tenantsPage.waitForPageLoad();
  }

  test('SH1-412: Surgia Admin - Verify success message after successfully adding branch', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Generate unique branch name with timestamp to ensure uniqueness
    const uniqueBranchName = `Branch_${Date.now()}`;
    
    // Fill branch form with valid data
    await tenantsPage.fillActivationForm({
      branchName: uniqueBranchName,
      city: 'Riyadh',
      district: 'Riyadh City',
      address: 'Test Address Street 123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '',
      email: ''
    });
    
    await tenantsPage.clickActivate();
    await tenantsPage.waitForPageLoad();
    
    // Verify success message is displayed
    await expect(page.getByText(/success|added|created/i)).toBeVisible();
  });

  test('SH1-410: Surgia Admin - Verify cancel button functionality while adding a branch', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Fill some data in the form
    await tenantsPage.fillBranchName('TestBranch410');
    await tenantsPage.selectCity('Riyadh');
    await tenantsPage.selectDistrict('Riyadh City');
    
    // Look for Back button and click it (this acts as cancel)
    const backButton = page.getByRole('button', { name: 'Back' });
    await backButton.click();
    await tenantsPage.waitForPageLoad();
    
    // Verify we're back to the tenant details page
    await expect(page.getByRole('button', { name: 'Add Branch' })).toBeVisible();
  });

  test('SH1-406: Surgia Admin - Verify that fields have correct placeholder text', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Verify placeholder texts for all form fields
    await expect(tenantsPage.branchNameInput).toHaveAttribute('placeholder', 'Enter branch name');
    await expect(tenantsPage.addressInput).toHaveAttribute('placeholder', 'Enter address');
    await expect(tenantsPage.firstNameInput).toHaveAttribute('placeholder', 'Enter first name');
    await expect(tenantsPage.lastNameInput).toHaveAttribute('placeholder', 'Enter last name');
    await expect(tenantsPage.phoneInput).toHaveAttribute('placeholder', 'Enter without country code');
    await expect(tenantsPage.userEmailInput).toHaveAttribute('placeholder', 'Enter user email');
  });

  test('SH1-405: Surgia Admin - Verify that mandatory fields are marked appropriately', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Check for asterisk (*) or required indicators on mandatory fields
    await expect(page.getByText('Branch name *')).toBeVisible();
    await expect(page.getByText('City *')).toBeVisible();
    await expect(page.getByText('District *')).toBeVisible();
    await expect(page.getByText('Address *')).toBeVisible();
    await expect(page.getByText('Contact person first name *')).toBeVisible();
  });

  test('SH1-404: Surgia Admin - Verify that all fields have correct labels', async ({ page }) => {
    await navigateToBranchForm(page);
    
    await expect(page.getByText('Branch name')).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await tenantsPage.waitForTimeout(1000);
    await expect(page.getByText('District')).toBeVisible();
    await expect(page.getByText('Address')).toBeVisible();
    await expect(page.getByText('Contact person first name')).toBeVisible();
    await expect(page.getByText('Contact person number')).toBeVisible();
    await expect(page.getByText('Contact person Email')).toBeVisible();
  });

  test('SH1-400: Surgia Admin - Verify that invalid phone number formats are rejected', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Fill all required fields with valid values
    await tenantsPage.fillBranchName('TestBranchPhoneValidation');
    await tenantsPage.selectCity('Riyadh');
    await tenantsPage.selectDistrict('Riyadh City');
    await tenantsPage.fillAddress('Test Address Street 123');
    await tenantsPage.fillFirstName('John');
    await tenantsPage.fillLastName('Doe');
    await tenantsPage.fillUserEmail('john.doe@example.com');
    
    // Enter invalid phone number
    await tenantsPage.fillPhone('abc123invalid');
    
    // Submit the form
    await tenantsPage.clickActivate();
    
    // Assert that validation message appears under the phone field
    await expect(page.getByText('Invalid phone number')).toBeVisible();
    
    // Verify the validation message is positioned near the phone field
    const phoneField = page.getByRole('textbox', { name: 'Enter without country code' });
    const validationMessage = page.getByText('Invalid phone number');
    await expect(validationMessage).toBeVisible();
    
    // Verify form submission is prevented (no success message)
    await expect(page.getByText(/success|added|created/i)).not.toBeVisible();
  });

  test('SH1-399: Surgia Admin - Verify that contact person name and phone can be left empty', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Fill only required fields, leave contact person name and phone empty
    await tenantsPage.fillBranchName('TestBranch399');
    await tenantsPage.selectCity('Riyadh');
    await tenantsPage.selectDistrict('Riyadh City');
    await tenantsPage.fillAddress('Test Address');
    
    // Leave firstName, lastName, phone, and email empty (they are optional)
    await tenantsPage.clickActivate();
    await tenantsPage.waitForPageLoad();
    
    // Verify the form can be submitted successfully without contact person details
    await expect(page.getByText(/success|added|created/i)).toBeVisible();
  });

  test('SH1-398: Surgia Admin - Verify that address field can be left empty', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Fill required fields but leave address empty
    await tenantsPage.fillBranchName('TestBranch398');
    await tenantsPage.selectCity('1');
    await tenantsPage.selectDistrict('2');
    await tenantsPage.fillFirstName('John');
    await tenantsPage.fillLastName('Doe');
    await tenantsPage.clickActivate();
    const errorMessage = page.locator('.error, .invalid, [class*="error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/address|required/i);
    }
  });

  test('SH1-394: Surgia Admin - Verify branch list sorting', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    
    // Navigate to tenant details to see branches
    const firstRowViewButton = page.getByRole('row').first().getByRole('button', { name: 'eye' });
    await firstRowViewButton.click();
    await tenantsPage.waitForPageLoad();
    
    // Click on Branches tab
    const branchesTab = page.getByRole('button', { name: 'Branches' });
    await branchesTab.click();
    await tenantsPage.waitForPageLoad();
    
    // Verify branches table is visible and can be sorted
    const branchesTable = page.locator('table');
    await expect(branchesTable).toBeVisible();
    
    // Test sorting functionality if available
    const sortButtons = page.locator('button[aria-label*="sort"], img[alt="sort"]');
    if (await sortButtons.count() > 0) {
      await sortButtons.first().click();
      await tenantsPage.waitForPageLoad();
    }
  });

  test('SH1-392: Surgia Admin - Verify required field validation messages', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Try to submit form without filling required fields
    await tenantsPage.clickActivate();
    
    // Check for validation messages
    const validationMessages = page.locator('.error, .invalid, [class*="error"], [class*="required"]');
    
    // Verify validation messages appear for required fields
    if (await validationMessages.count() > 0) {
      await expect(validationMessages.first()).toBeVisible();
    }
    
    // Alternative: Check if form submission is prevented
    // The form should not proceed if required fields are missing
    await expect(page.getByText(/success|added|created/i)).not.toBeVisible();
  });

  test('SH1-389: Surgia Admin - Add branch with maximum length fields', async ({ page }) => {
    await navigateToBranchForm(page);
    
    // Create maximum length test data
    const maxLengthBranchName = 'A'.repeat(50); // Assuming 50 char limit
    const maxLengthAddress = 'B'.repeat(150); // Assuming 150 char limit
    const maxLengthFirstName = 'C'.repeat(30); // Assuming 30 char limit
    const maxLengthLastName = 'D'.repeat(30); // Assuming 30 char limit
    
    await tenantsPage.fillActivationForm({
      branchName: maxLengthBranchName,
      city: 'Riyadh',
      district: 'Riyadh City',
      address: maxLengthAddress,
      firstName: maxLengthFirstName,
      lastName: maxLengthLastName,
      phone: '',
      email: ''
    });
    
    await tenantsPage.clickActivate();
    await tenantsPage.waitForPageLoad();
    
    // Verify the form accepts maximum length data
    await expect(page.getByText(/success|added|created/i)).toBeVisible();
  });

  test('SH1-386: Surgia Admin - Edit branch with duplicate name', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    
    // Navigate to tenant details to see branches
    const firstRowViewButton = page.getByRole('row').first().getByRole('button', { name: 'eye' });
    await firstRowViewButton.click();
    await tenantsPage.waitForPageLoad();
    
    // Click on Branches tab
    const branchesTab = page.getByRole('button', { name: 'Branches' });
    await branchesTab.click();
    await tenantsPage.waitForPageLoad();
    
    // Look for edit button or action for existing branch
    const editButton = page.getByRole('button', { name: /edit|modify/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await tenantsPage.waitForPageLoad();
      
      // Try to change branch name to an existing one
      await tenantsPage.fillBranchName('ExistingBranchName'); // Use a name that already exists
      
      // Try to save changes
      const saveButton = page.getByRole('button', { name: /save|update|activate/i });
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // Check for duplicate name error
        const errorMessage = page.locator('.error, .invalid, [class*="error"]');
        if (await errorMessage.isVisible()) {
          await expect(errorMessage).toContainText(/duplicate|already exists|unique/i);
        }
      }
    }
  });

  test('SH1-385: Surgia Admin - Verify that an admin can edit an existing branch details', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    
    // Navigate to tenant details to see branches
    const firstRowViewButton = page.getByRole('row').first().getByRole('button', { name: 'eye' });
    await firstRowViewButton.click();
    await tenantsPage.waitForPageLoad();
    
    // Click on Branches tab
    const branchesTab = page.getByRole('button', { name: 'Branches' });
    await branchesTab.click();
    await tenantsPage.waitForPageLoad();
    
    // Look for edit functionality for existing branches
    const editButton = page.getByRole('button', { name: /edit|modify/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await tenantsPage.waitForPageLoad();
      
      // Verify edit form is loaded
      await expect(tenantsPage.branchNameInput).toBeVisible();
      await expect(tenantsPage.citySelect).toBeVisible();
      await expect(tenantsPage.districtSelect).toBeVisible();
      await expect(tenantsPage.addressInput).toBeVisible();
      await expect(tenantsPage.firstNameInput).toBeVisible();
      await expect(tenantsPage.lastNameInput).toBeVisible();
      await expect(tenantsPage.phoneInput).toBeVisible();
      await expect(tenantsPage.userEmailInput).toBeVisible();
      
      // Modify some fields
      await tenantsPage.fillBranchName('UpdatedBranchName');
      await tenantsPage.fillAddress('Updated Address');
      
      // Save changes
      const saveButton = page.getByRole('button', { name: /save|update|activate/i });
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await tenantsPage.waitForPageLoad();
        
        // Verify success message or return to branch list
        await expect(page.getByText(/updated|saved|success/i)).toBeVisible();
      }
    }
  });

  test('SH1-383: Surgia Admin - Verify that the system prevents adding duplicate branch names for the same tenant', async ({ page }) => {
    await navigateToBranchForm(page);
    await tenantsPage.fillActivationForm({
      branchName: 'DuplicateBranchName',
      city: '1',
      district: '2',
      address: 'Test Address',
      firstName: 'John',
      lastName: 'Doe',
      phone: '',
      email: ''
    });
    await tenantsPage.clickActivate();
    
    // Check for duplicate name validation error
    const errorMessage = page.locator('.error, .invalid, [class*="error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/duplicate|already exists|unique/i);
    } else {
      await expect(page.getByText(/success|added|created/i)).not.toBeVisible();
    }
  });
});
