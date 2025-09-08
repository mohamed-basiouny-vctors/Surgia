import { expect, type Locator, type Page } from "@playwright/test";

export class TenantsPage {
    //=====================Locators=====================
    readonly page: Page;
    
    // Navigation Elements
    readonly tenantsLink: Locator;
    
    // Tab Elements
    readonly pendingTab: Locator;
    readonly activeTab: Locator;
    
    // Table Elements
    readonly firstRowTenthColumn: Locator;
    readonly firstRowEleventhColumn: Locator;
    readonly firstRowThirdColumn: Locator;
    
    // Action Buttons
    readonly activateNowButton: Locator;
    readonly nextButton: Locator;
    readonly activateButton: Locator;
    readonly confirmButton: Locator;
    
    // Form Fields
    readonly branchNameInput: Locator;
    readonly citySelect: Locator;
    readonly districtSelect: Locator;
    readonly addressInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly phoneInput: Locator;
    readonly userEmailInput: Locator;
    
    // Success Messages
    readonly tenantActivatedMessage: Locator;
    
    // Table Headers
    readonly idHeader: Locator;
    readonly tenantNameHeader: Locator;
    readonly typeHeader: Locator;
    readonly cityHeader: Locator;
    readonly statusHeader: Locator;
    readonly discountHeader: Locator;
    readonly contactNameHeader: Locator;
    readonly contactDetailsHeader: Locator;
    readonly dateCreatedHeader: Locator;
    readonly numberOfBranchesHeader: Locator;
    
    // URLs
    readonly baseUrl: string = "https://hub-surgia-test.dentacartscloud.net";
    
    //=====================Constructor==================
    constructor(page: Page) {
        this.page = page;
        
        // Navigation Elements
        this.tenantsLink = page.getByRole('link', { name: 'Tenants' });
        
        // Tab Elements
        this.pendingTab = page.getByRole('button', { name: 'Pending' });
        this.activeTab = page.getByRole('button', { name: 'Active' });
        
        // Table Elements
        this.firstRowTenthColumn = page.locator('td:nth-child(10)').first();
        this.firstRowEleventhColumn = page.locator('td:nth-child(11)').first();
        this.firstRowThirdColumn = page.locator('td:nth-child(3)').first();
        
        // Action Buttons
        this.activateNowButton = page.getByRole('button', { name: 'Activate now' });
        this.nextButton = page.getByRole('button', { name: 'Next' }).nth(1);
        this.activateButton = page.getByRole('button', { name: 'Activate' });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        
        // Form Fields
        this.branchNameInput = page.getByRole('textbox', { name: 'Enter branch name' });
        this.citySelect = page.locator('select[name="city"]');
        this.districtSelect = page.locator('select[name="district"]');
        this.addressInput = page.getByRole('textbox', { name: 'Enter address' });
        this.firstNameInput = page.getByRole('textbox', { name: 'Enter first name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Enter last name' });
        this.phoneInput = page.getByRole('textbox', { name: 'Enter without country code' });
        this.userEmailInput = page.getByRole('textbox', { name: 'Enter user email' });
        
        // Success Messages
        this.tenantActivatedMessage = page.getByText('Tenant was activated');
        
        // Table Headers
        this.idHeader = page.getByText('ID');
        this.tenantNameHeader = page.getByText('Tenant Name');
        this.typeHeader = page.getByText('Type');
        this.cityHeader = page.getByText('City');
        this.statusHeader = page.getByText('Status');
        this.discountHeader = page.getByText('Discount %');
        this.contactNameHeader = page.getByText('Contact Name');
        this.contactDetailsHeader = page.getByText('Contact Details');
        this.dateCreatedHeader = page.getByText('Date Created');
        this.numberOfBranchesHeader = page.getByText('Number of Branches');
    }
    
    //=====================Methods======================
    
    // Navigation Methods
    async navigateToTenants() {
        await this.tenantsLink.click();
    }
    
    async clickPendingTab() {
        await this.pendingTab.click();
    }
    
    async clickActiveTab() {
        await this.activeTab.click();
    }
    
    // Table Interaction Methods
    async clickFirstRowTenthColumn() {
        await this.firstRowTenthColumn.click();
    }
    
    async verifyFirstRowEleventhColumn() {
        await expect(this.firstRowEleventhColumn).toBeVisible();
    }
    
    async verifyFirstRowThirdColumn() {
        await expect(this.firstRowThirdColumn).toBeVisible();
    }
    
    // Activation Process Methods
    async clickActivateNow() {
        await this.activateNowButton.click();
    }
    
    async clickNext() {
        await this.nextButton.click();
    }
    
    async clickActivate() {
        await this.activateButton.click();
    }
    
    async clickConfirm() {
        await this.confirmButton.click();
    }
    
    // Form Filling Methods
    async fillBranchName(branchName: string) {
        await this.branchNameInput.click();
        await this.branchNameInput.fill(branchName);
    }
    
    async selectCity(cityOption: string) {
        await this.citySelect.selectOption(cityOption);
    }
    
    async selectDistrict(districtOption: string) {
        await this.districtSelect.selectOption(districtOption);
    }
    
    async fillAddress(address: string) {
        await this.addressInput.click();
        await this.addressInput.fill(address);
    }
    
    async fillFirstName(firstName: string) {
        await this.firstNameInput.click();
        await this.firstNameInput.fill(firstName);
    }
    
    async fillLastName(lastName: string) {
        await this.lastNameInput.click();
        await this.lastNameInput.fill(lastName);
    }
    
    async fillPhone(phone: string) {
        await this.phoneInput.click();
        await this.phoneInput.fill(phone);
    }
    
    async fillUserEmail(email: string) {
        await this.userEmailInput.click();
        await this.userEmailInput.fill(email);
    }
    
    // Complete Form Filling Method
    async fillActivationForm(formData: {
        branchName: string;
        city: string;
        district: string;
        address: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    }) {
        await this.fillBranchName(formData.branchName);
        await this.selectCity(formData.city);
        await this.selectDistrict(formData.district);
        await this.fillAddress(formData.address);
        await this.fillFirstName(formData.firstName);
        await this.fillLastName(formData.lastName);
        await this.fillPhone(formData.phone);
        await this.fillUserEmail(formData.email);
    }
    
    // Verification Methods
    async verifyTenantActivated() {
        await expect(this.tenantActivatedMessage).toBeVisible();
    }
    
    // Table Header Verification Methods
    async verifyPendingTableHeaders() {
        await expect(this.idHeader).toBeVisible();
        await expect(this.tenantNameHeader).toBeVisible();
        await expect(this.typeHeader).toBeVisible();
        await expect(this.cityHeader).toBeVisible();
        await expect(this.statusHeader).toBeVisible();
        await expect(this.discountHeader).toBeVisible();
        await expect(this.contactNameHeader).toBeVisible();
        await expect(this.contactDetailsHeader).toBeVisible();
        await expect(this.dateCreatedHeader).toBeVisible();
    }
    
    async verifyActiveTableHeaders() {
        await expect(this.idHeader).toBeVisible();
        await expect(this.tenantNameHeader).toBeVisible();
        await expect(this.typeHeader).toBeVisible();
        await expect(this.cityHeader).toBeVisible();
        await expect(this.numberOfBranchesHeader).toBeVisible();
        await expect(this.statusHeader).toBeVisible();
        await expect(this.discountHeader).toBeVisible();
        await expect(this.contactNameHeader).toBeVisible();
        await expect(this.contactDetailsHeader).toBeVisible();
        await expect(this.dateCreatedHeader).toBeVisible();
    }
    
    // Complete Activation Workflow Method
    async completeTenantActivation(formData: {
        branchName: string;
        city: string;
        district: string;
        address: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    }) {
        // Navigate to tenants
        await this.navigateToTenants();
        
        // Click on pending tab
        await this.clickPendingTab();
        
        // Click on first row, tenth column
        await this.clickFirstRowTenthColumn();
        
        // Click activate now
        await this.clickActivateNow();
        
        // Click next
        await this.clickNext();
        
        // Fill the activation form
        await this.fillActivationForm(formData);
        
        // Click activate
        await this.clickActivate();
        
        // Click confirm
        await this.clickConfirm();
        
        // Verify success message
        await this.verifyTenantActivated();
    }
    
    // Complete Table Verification Workflow Method
    async completeTableVerificationWorkflow() {
        // Navigate to tenants
        await this.navigateToTenants();
        
        // Click on pending tab and verify headers
        await this.clickPendingTab();
        await this.verifyPendingTableHeaders();
        
        // Verify specific table cells
        await expect(this.firstRowTenthColumn).toBeVisible();
        await expect(this.firstRowThirdColumn).toBeVisible();
        
        // Click on active tab and verify headers
        await this.clickActiveTab();
        await this.verifyActiveTableHeaders();
        
        // Verify specific table cells
        await expect(this.firstRowEleventhColumn).toBeVisible();
    }
    
    // Utility Methods
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForTimeout(timeout: number) {
        await this.page.waitForTimeout(timeout);
    }
}
