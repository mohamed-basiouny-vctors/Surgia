import { expect, type Locator, type Page } from "@playwright/test";

export class Tenant_Branches {
  readonly page: Page;
  
  // Table headers
  readonly branchNameHeader: Locator;
  readonly cityHeader: Locator;
  readonly areaHeader: Locator;
  readonly usersHeader: Locator;
  readonly contactNameHeader: Locator;
  readonly contactDetailsHeader: Locator;
  readonly dateCreatedHeader: Locator;
  
  // Table data
  readonly branchNameCells: Locator;
  readonly cityCells: Locator;
  readonly areaCells: Locator;
  readonly usersCells: Locator;
  readonly contactNameCells: Locator;
  readonly contactDetailsCells: Locator;
  readonly dateCreatedCells: Locator;
  
  // Actions
  readonly editBranchLink: Locator;
  readonly addBranchButton: Locator;
  
  // Pagination
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly pageNumberButtons: Locator;
  
  // Filters
  readonly cityFilter: Locator;
  readonly searchInput: Locator;
  
  // Table
  readonly branchesTable: Locator;
  readonly branchRows: Locator;
  
  // Loading elements
  readonly loadingIndicator: Locator;
  readonly loadingText: Locator;
  
  //=====================Constructor==================
  constructor(page: Page) {
    this.page = page;
    
    // Table headers
    this.branchNameHeader = page.getByRole('cell', { name: 'Branch name sort' });
    this.cityHeader = page.getByRole('cell', { name: 'City sort' });
    this.areaHeader = page.getByRole('cell', { name: 'Area sort' });
    this.usersHeader = page.getByRole('cell', { name: 'Users sort' });
    this.contactNameHeader = page.getByRole('cell', { name: 'Contact name sort' });
    this.contactDetailsHeader = page.getByRole('cell', { name: 'Contact details' });
    this.dateCreatedHeader = page.getByRole('cell', { name: 'Date created sort' });
    
    // Table data cells
    this.branchNameCells = page.locator('table tbody tr td:nth-child(3)');
    this.cityCells = page.locator('table tbody tr td:nth-child(4)');
    this.areaCells = page.locator('table tbody tr td:nth-child(5)');
    this.usersCells = page.locator('table tbody tr td:nth-child(6)');
    this.contactNameCells = page.locator('table tbody tr td:nth-child(7)');
    this.contactDetailsCells = page.locator('table tbody tr td:nth-child(8)');
    this.dateCreatedCells = page.locator('table tbody tr td:nth-child(9)');
    
    // Actions
    this.editBranchLink = page.getByRole('link', { name: 'Edit branch' });
    this.addBranchButton = page.getByRole('button', { name: 'Add Branch' });
    
    // Pagination
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.pageNumberButtons = page.locator('button').filter({ hasText: /^\d+$/ });
    
    // Filters
    this.cityFilter = page.locator('select').first();
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    
    // Table
    this.branchesTable = page.locator('table');
    this.branchRows = page.locator('table tbody tr');
    
    // Loading elements
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-spinner, .spinner');
    this.loadingText = page.getByText('Loading branches...');
  }
  
  //=====================Methods======================
  
  // Navigation methods
  async navigateToBranches() {
    await this.page.getByRole('link', { name: 'Branches' }).click();
    await this.page.waitForLoadState('networkidle');
  }
  
  // Sorting methods
  async sortByBranchName() {
    await this.branchNameHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async sortByCity() {
    await this.cityHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async sortByArea() {
    await this.areaHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async sortByUsers() {
    await this.usersHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async sortByContactName() {
    await this.contactNameHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async sortByDateCreated() {
    await this.dateCreatedHeader.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  // Filtering methods
  async filterByCity(cityName: string) {
    await this.cityFilter.selectOption(cityName);
    await this.page.waitForLoadState('networkidle');
  }
  
  async selectAllBranches() {
    await this.cityFilter.selectOption('All Branches');
    await this.page.waitForLoadState('networkidle');
  }
  
  async searchBranches(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForLoadState('networkidle');
  }
  
  // Pagination methods
  async goToNextPage() {
    if (!(await this.nextButton.isDisabled())) {
      await this.nextButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
  
  async goToPreviousPage() {
    if (!(await this.previousButton.isDisabled())) {
      await this.previousButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
  
  async goToPage(pageNumber: number) {
    const pageButton = this.page.getByRole('button', { name: pageNumber.toString() });
    if (await pageButton.isVisible()) {
      await pageButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
  
  // Verification methods
  async verifyTableHeaders() {
    await expect(this.branchNameHeader).toBeVisible();
    await expect(this.cityHeader).toBeVisible();
    await expect(this.areaHeader).toBeVisible();
    await expect(this.usersHeader).toBeVisible();
    await expect(this.contactNameHeader).toBeVisible();
    await expect(this.contactDetailsHeader).toBeVisible();
    await expect(this.dateCreatedHeader).toBeVisible();
  }
  
  async verifyBranchData() {
    await expect(this.branchRows.first()).toBeVisible();
    await expect(this.branchNameCells.first()).toBeVisible();
    await expect(this.cityCells.first()).toBeVisible();
  }
  
  async getBranchCount() {
    return await this.branchRows.count();
  }
  
  async getAllBranchNames() {
    return await this.branchNameCells.allTextContents();
  }
  
  async getAllCities() {
    return await this.cityCells.allTextContents();
  }
  
  async getAllAreas() {
    return await this.areaCells.allTextContents();
  }
  
  async getAllContactNames() {
    return await this.contactNameCells.allTextContents();
  }
  
  async getAllContactDetails() {
    return await this.contactDetailsCells.allTextContents();
  }
  
  // Utility methods
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  
  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }
  
  async waitForLoadingToComplete(timeout: number = 30000) {
    // Wait for loading text to disappear
    await this.page.waitForFunction(
      () => !document.querySelector('text')?.textContent?.includes('Loading branches...'),
      { timeout }
    );
    
    // Wait for loading spinner to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
    
    // Wait for table to be visible
    await this.branchesTable.waitFor({ state: 'visible', timeout });
    
    // Wait for at least one branch row to be visible
    await this.branchRows.first().waitFor({ state: 'visible', timeout });
  }
}