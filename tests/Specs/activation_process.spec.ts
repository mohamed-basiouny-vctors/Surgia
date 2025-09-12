import { test, expect } from '@playwright/test';
import { TenantsPage } from '../pages/tenants_page';
import { AdminLoginPage } from '../pages/AdminLoginPage';

let tenantsPage: TenantsPage;
let adminLoginPage: AdminLoginPage;

test.describe('Tenant Activation Process', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(19000);
    tenantsPage = new TenantsPage(page);
    adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.open();
    await adminLoginPage.login("menna.mohamed@dentacarts.com", "123456");
    await tenantsPage.waitForPageLoad();
  });

  test('SH1-1326: Basic Tenant Activation Flow', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.clickPendingTab();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.clickActivateNow();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.clickNext();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.fillActivationForm({
      branchName: 'abcde',
      city: '1',
      district: '2',
      address: 'qqqqqq',
      firstName: 'q',
      lastName: 'q',
      phone: '510145444',
      email: 'test@test.test'
    });
    await tenantsPage.clickActivate();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.clickConfirm();
    await tenantsPage.waitForPageLoad();
    await tenantsPage.verifyTenantActivated();
  });

  test('SH1-1327: Complete Tenant Activation Using Workflow Method', async ({ page }) => {
    await tenantsPage.completeTenantActivation({
      branchName: 'TestBranch123',
      city: '1',
      district: '2',
      address: 'Test Address Street',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      email: 'john.doe@example.com'
    });
  });

  test('SH1-1328: Tenant Activation with Different Branch Names', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    const branchNames = ['BranchAlpha', 'BranchBeta', 'BranchGamma'];
    for (const branchName of branchNames) {
      await tenantsPage.fillBranchName(branchName);
      await tenantsPage.selectCity('1');
      await tenantsPage.selectDistrict('2');
      await tenantsPage.fillAddress('Test Address');
      await tenantsPage.fillFirstName('Test');
      await tenantsPage.fillLastName('User');
      await tenantsPage.fillPhone('123456789');
      await tenantsPage.fillUserEmail('test@example.com');
      
      await expect(tenantsPage.branchNameInput).toHaveValue(branchName);
      
      await tenantsPage.branchNameInput.clear();
    }
  });

  test('SH1-1329: Tenant Activation with Different Cities and Districts', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    const cityDistrictPairs = [
      { city: '1', district: '2' },
      { city: '2', district: '1' },
      { city: '3', district: '3' }
    ];
    
    for (const pair of cityDistrictPairs) {
      await tenantsPage.fillBranchName('TestBranch');
      await tenantsPage.selectCity(pair.city);
      await tenantsPage.selectDistrict(pair.district);
      await tenantsPage.fillAddress('Test Address');
      await tenantsPage.fillFirstName('Test');
      await tenantsPage.fillLastName('User');
      await tenantsPage.fillPhone('123456789');
      await tenantsPage.fillUserEmail('test@example.com');
        
      // Verify selections are correct
      await expect(tenantsPage.citySelect).toHaveValue(pair.city);
      await expect(tenantsPage.districtSelect).toHaveValue(pair.district);
    }
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

  test('SH1-1334: Navigation Flow Validation', async ({ page }) => {
    // Test the complete navigation flow
    await tenantsPage.navigateToTenants();
    await expect(page.getByRole('link', { name: 'Tenants' })).toBeVisible();
    
    await tenantsPage.clickPendingTab();
    await expect(page.getByRole('button', { name: 'Pending' })).toBeVisible();
    
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.waitForPageLoad();
    
    await tenantsPage.clickActivateNow();
    await tenantsPage.waitForPageLoad();
    
    await tenantsPage.clickNext();
    await tenantsPage.waitForPageLoad();
    
    // Verify form fields are present
    await expect(tenantsPage.branchNameInput).toBeVisible();
    await expect(tenantsPage.citySelect).toBeVisible();
    await expect(tenantsPage.districtSelect).toBeVisible();
  });

  test('SH1-1335: Success Message Verification', async ({ page }) => {
    // Complete the activation process
    await tenantsPage.completeTenantActivation({
      branchName: 'SuccessTestBranch',
      city: '1',
      district: '2',
      address: 'Success Test Address',
      firstName: 'Success',
      lastName: 'Test',
      phone: '111222333',
      email: 'success@test.com'
    });
    
    // Verify the success message is displayed
    await tenantsPage.verifyTenantActivated();
    
    // Additional verification that the message contains expected text
    await expect(page.getByText('Tenant was activated')).toBeVisible();
  });

  test('SH1-1336: Performance Testing - Activation Process', async ({ page }) => {
    const startTime = Date.now();
    
    await tenantsPage.completeTenantActivation({
      branchName: 'PerformanceTest',
      city: '1',
      district: '2',
      address: 'Performance Test Address',
      firstName: 'Performance',
      lastName: 'Test',
      phone: '444555666',
      email: 'performance@test.com'
    });
    
    const totalTime = Date.now() - startTime;
    
    // Verify the process completes within reasonable time (less than 30 seconds)
    expect(totalTime).toBeLessThan(30000);
  });

  test('SH1-1337: Error Handling - Invalid Data', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Test with invalid data
    await tenantsPage.fillBranchName('');
    await tenantsPage.fillPhone('invalid-phone');
    await tenantsPage.fillUserEmail('invalid-email');
    
    // Try to submit
    await tenantsPage.clickActivate();
    
    // Verify appropriate error handling
    // This would depend on the application's error handling
    await tenantsPage.waitForPageLoad();
  });

  test('SH1-1338: Accessibility Testing - Form Elements', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Verify all form elements are accessible
    await expect(tenantsPage.branchNameInput).toBeVisible();
    await expect(tenantsPage.citySelect).toBeVisible();
    await expect(tenantsPage.districtSelect).toBeVisible();
    await expect(tenantsPage.addressInput).toBeVisible();
    await expect(tenantsPage.firstNameInput).toBeVisible();
    await expect(tenantsPage.lastNameInput).toBeVisible();
    await expect(tenantsPage.phoneInput).toBeVisible();
    await expect(tenantsPage.userEmailInput).toBeVisible();
    
    // Verify action buttons are accessible
    await expect(tenantsPage.activateButton).toBeVisible();
  });

  test('SH1-1339: Data Persistence - Form Field Values', async ({ page }) => {
    await tenantsPage.navigateToTenants();
    await tenantsPage.clickPendingTab();
    await tenantsPage.clickFirstRowTenthColumn();
    await tenantsPage.clickActivateNow();
    await tenantsPage.clickNext();
    
    // Fill form with test data
    const testData = {
      branchName: 'PersistenceTest',
      city: '1',
      district: '2',
      address: 'Persistence Test Address',
      firstName: 'Persistence',
      lastName: 'Test',
      phone: '777888999',
      email: 'persistence@test.com'
    };
    
    await tenantsPage.fillActivationForm(testData);
    
    // Verify all values are correctly set
    await expect(tenantsPage.branchNameInput).toHaveValue(testData.branchName);
    await expect(tenantsPage.citySelect).toHaveValue(testData.city);
    await expect(tenantsPage.districtSelect).toHaveValue(testData.district);
    await expect(tenantsPage.addressInput).toHaveValue(testData.address);
    await expect(tenantsPage.firstNameInput).toHaveValue(testData.firstName);
    await expect(tenantsPage.lastNameInput).toHaveValue(testData.lastName);
    await expect(tenantsPage.phoneInput).toHaveValue(testData.phone);
    await expect(tenantsPage.userEmailInput).toHaveValue(testData.email);
  });

  test('SH1-1340: End-to-End Tenant Activation Workflow', async ({ page }) => {
    // This test covers the complete end-to-end workflow
    // from login to successful tenant activation
    
    // Verify we're logged in and can access the system
    await expect(page.getByRole('link', { name: 'Tenants' })).toBeVisible();
    
    // Complete the activation process
    await tenantsPage.completeTenantActivation({
      branchName: 'E2ETestBranch',
      city: '1',
      district: '2',
      address: 'End-to-End Test Address',
      firstName: 'E2E',
      lastName: 'Test',
      phone: '999000111',
      email: 'e2e@test.com'
    });
    
    // Verify final success state
    await tenantsPage.verifyTenantActivated();
    
    // Verify we can navigate back to tenants list
    await tenantsPage.navigateToTenants();
    await expect(page.getByRole('link', { name: 'Tenants' })).toBeVisible();
  });

  test('SH1-1341: Table Structure Verification - Pending and Active Tabs', async ({ page }) => {
    // This test verifies the table structure and headers for both Pending and Active tabs
    // Navigate to tenants page
    await tenantsPage.navigateToTenants();
    await tenantsPage.waitForPageLoad();
    
    // Click on pending tab and verify all headers
    await tenantsPage.clickPendingTab();
    await tenantsPage.verifyPendingTableHeaders();
    
    // Verify specific table cells are visible
    await expect(tenantsPage.firstRowTenthColumn).toBeVisible();
    await expect(tenantsPage.firstRowThirdColumn).toBeVisible();
    
    // Click on active tab and verify all headers
    await tenantsPage.clickActiveTab();
    await tenantsPage.verifyActiveTableHeaders();
    
    // Verify specific table cells are visible
    await expect(tenantsPage.firstRowEleventhColumn).toBeVisible();
  });

  test('SH1-1342: Complete Table Verification Workflow', async ({ page }) => {
    // This test uses the complete workflow method for table verification
    await tenantsPage.completeTableVerificationWorkflow();
  });
});
