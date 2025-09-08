import { expect, type Locator, type Page } from "@playwright/test";

export class Tenant_Users {
  readonly page: Page;
  
  // Navigation
  readonly usersLink: Locator;
  
  // User management elements
  readonly addUserButton: Locator;
  readonly inviteUserButton: Locator;
  readonly userTable: Locator;
  readonly userRows: Locator;
  
  // User form fields
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly roleSelect: Locator;
  readonly branchSelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  
  // User table columns
  readonly emailColumn: Locator;
  readonly nameColumn: Locator;
  readonly roleColumn: Locator;
  readonly statusColumn: Locator;
  readonly branchColumn: Locator;
  readonly actionsColumn: Locator;
  
  // Status indicators
  readonly pendingStatus: Locator;
  readonly activeStatus: Locator;
  readonly inactiveStatus: Locator;
  
  // Error messages
  readonly errorMessage: Locator;
  readonly duplicateEmailError: Locator;
  
  // Branch access elements
  readonly branchCheckboxes: Locator;
  readonly selectAllBranches: Locator;
  
  // User actions
  readonly editUserButton: Locator;
  readonly deleteUserButton: Locator;
  readonly resendInviteButton: Locator;
  
  // Loading elements
  readonly loadingIndicator: Locator;
  readonly loadingText: Locator;

  //=====================Constructor==================
  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.usersLink = page.getByRole('link', { name: 'Users' });
    
    // User management elements
    this.addUserButton = page.getByRole('button', { name: 'Add User' });
    this.inviteUserButton = page.getByRole('button', { name: 'Invite User' });
    this.userTable = page.locator('table');
    this.userRows = page.locator('table tbody tr');
    
    // User form fields
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.roleSelect = page.getByRole('combobox', { name: 'Role' });
    this.branchSelect = page.getByRole('combobox', { name: 'Branch' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    
    // User table columns
    this.emailColumn = page.locator('table th').filter({ hasText: 'Email' });
    this.nameColumn = page.locator('table th').filter({ hasText: 'Name' });
    this.roleColumn = page.locator('table th').filter({ hasText: 'Role' });
    this.statusColumn = page.locator('table th').filter({ hasText: 'Status' });
    this.branchColumn = page.locator('table th').filter({ hasText: 'Branch' });
    this.actionsColumn = page.locator('table th').filter({ hasText: 'Actions' });
    
    // Status indicators
    this.pendingStatus = page.locator('.status-pending, [data-status="pending"]');
    this.activeStatus = page.locator('.status-active, [data-status="active"]');
    this.inactiveStatus = page.locator('.status-inactive, [data-status="inactive"]');
    
    // Error messages
    this.errorMessage = page.locator('.error-message, .alert-error');
    this.duplicateEmailError = page.getByText('Email already exists');
    
    // Branch access elements
    this.branchCheckboxes = page.locator('input[type="checkbox"][name*="branch"]');
    this.selectAllBranches = page.getByRole('checkbox', { name: 'Select All Branches' });
    
    // User actions
    this.editUserButton = page.getByRole('button', { name: 'Edit' });
    this.deleteUserButton = page.getByRole('button', { name: 'Delete' });
    this.resendInviteButton = page.getByRole('button', { name: 'Resend Invite' });
    
    // Loading elements
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-spinner, .spinner');
    this.loadingText = page.getByText('Loading users...');
  }
  
  //=====================Methods======================
  
  // Navigation methods
  async navigateToUsers() {
    await this.usersLink.click();
    await this.waitForLoadingToComplete();
  }
  
  // User creation methods
  async openAddUserForm() {
    await this.addUserButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async fillUserForm(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
    branches?: string[];
  }) {
    await this.emailInput.fill(userData.email);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    
    if (userData.phone) {
      await this.phoneInput.fill(userData.phone);
    }
    
    await this.roleSelect.selectOption(userData.role);
    
    if (userData.branches && userData.branches.length > 0) {
      for (const branch of userData.branches) {
        await this.selectBranch(branch);
      }
    }
  }
  
  async selectBranch(branchName: string) {
    const branchCheckbox = this.page.getByRole('checkbox', { name: branchName });
    await branchCheckbox.check();
  }
  
  async selectAllBranchesAccess() {
    await this.selectAllBranches.check();
  }
  
  async submitUserForm() {
    await this.submitButton.click();
    await this.waitForLoadingToComplete();
  }
  
  async cancelUserForm() {
    await this.cancelButton.click();
  }
  
  // User invitation methods
  async inviteUser(email: string, role: string, branches?: string[]) {
    await this.openAddUserForm();
    await this.fillUserForm({
      email,
      firstName: 'Test',
      lastName: 'User',
      role,
      branches
    });
    await this.submitUserForm();
  }
  
  // User management methods
  async getUserByEmail(email: string) {
    return this.userRows.filter({ hasText: email });
  }
  
  async getUserStatus(email: string) {
    const userRow = await this.getUserByEmail(email);
    return await userRow.locator('.status').textContent();
  }
  
  async editUser(email: string) {
    const userRow = await this.getUserByEmail(email);
    await userRow.locator(this.editUserButton).click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async deleteUser(email: string) {
    const userRow = await this.getUserByEmail(email);
    await userRow.locator(this.deleteUserButton).click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async resendInvite(email: string) {
    const userRow = await this.getUserByEmail(email);
    await userRow.locator(this.resendInviteButton).click();
    await this.waitForLoadingToComplete();
  }
  
  // Verification methods
  async verifyUserExists(email: string) {
    const userRow = await this.getUserByEmail(email);
    await expect(userRow).toBeVisible();
  }
  
  async verifyUserStatus(email: string, expectedStatus: string) {
    const userRow = await this.getUserByEmail(email);
    const statusElement = userRow.locator('.status');
    await expect(statusElement).toHaveText(expectedStatus);
  }
  
  async verifyUserRole(email: string, expectedRole: string) {
    const userRow = await this.getUserByEmail(email);
    const roleElement = userRow.locator('.role');
    await expect(roleElement).toHaveText(expectedRole);
  }
  
  async verifyUserBranches(email: string, expectedBranches: string[]) {
    const userRow = await this.getUserByEmail(email);
    const branchElement = userRow.locator('.branches');
    const branchText = await branchElement.textContent();
    
    for (const branch of expectedBranches) {
      expect(branchText).toContain(branch);
    }
  }
  
  async verifyErrorDisplayed(errorText: string) {
    await expect(this.errorMessage).toContainText(errorText);
  }
  
  async verifyDuplicateEmailError() {
    await expect(this.duplicateEmailError).toBeVisible();
  }
  
  // Utility methods
  async waitForLoadingToComplete(timeout: number = 30000) {
    // Wait for loading text to disappear
    await this.page.waitForFunction(
      () => !document.querySelector('text')?.textContent?.includes('Loading users...'),
      { timeout }
    );
    
    // Wait for loading spinner to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
    
    // Wait for table to be visible
    await this.userTable.waitFor({ state: 'visible', timeout });
  }
  
  async getUsersCount() {
    return await this.userRows.count();
  }
  
  async getAllUserEmails() {
    return await this.userRows.locator('td:nth-child(1)').allTextContents();
  }
  
  async getAllUserRoles() {
    return await this.userRows.locator('td:nth-child(3)').allTextContents();
  }
  
  async getAllUserStatuses() {
    return await this.userRows.locator('td:nth-child(4)').allTextContents();
  }
  
  // Permission verification methods
  async verifyNonAdminCannotInviteUsers() {
    // Check if add user button is disabled or not visible for non-admin
    const isAddButtonVisible = await this.addUserButton.isVisible();
    const isAddButtonEnabled = await this.addUserButton.isEnabled();
    
    return !isAddButtonVisible || !isAddButtonEnabled;
  }
  
  async verifyAdminCanInviteUsers() {
    // Check if add user button is visible and enabled for admin
    const isAddButtonVisible = await this.addUserButton.isVisible();
    const isAddButtonEnabled = await this.addUserButton.isEnabled();
    
    return isAddButtonVisible && isAddButtonEnabled;
  }
}
