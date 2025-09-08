import { expect, type Locator, type Page } from "@playwright/test";

export class Catalog_pr_page {
    //=====================Locators=====================
    readonly page: Page;
    
    // Catalog Page Locators
    readonly addToCartButton: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;
    readonly brandFilter3M: Locator;
    readonly brandFilterIBI: Locator;
    readonly priceRangeMin: Locator;
    readonly priceRangeMax: Locator;
    readonly resetFiltersButton: Locator;
    readonly productsHeading: Locator;
    readonly noProductsFoundMessage: Locator;
    readonly filtersButton: Locator;
    readonly catalogBranchSelector: Locator;
    readonly cartSubmitPR: Locator;
    
    // Product Page Locators
    readonly productCard: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly addToCartPR: Locator;
    readonly productImage: Locator;
    readonly productDescription: Locator;
    readonly variantSelector: Locator;
    readonly quantityInput: Locator;
    readonly productModal: Locator;
    readonly modalCloseButton: Locator;
    readonly modalAddToCartButton: Locator;
    readonly cartIcon: Locator;
    readonly cartItemCount: Locator;
    readonly firstVariantColor: Locator;
    readonly firstVariantSize: Locator;
    readonly secondVariantColor: Locator;
    readonly secondVariantSize: Locator;
    readonly itemAddToPR: Locator;
    
    // Purchase Request Page Locators
    readonly createPOButton: Locator;
    readonly purchaseRequestBranchSelector: Locator;
    readonly submittedTab: Locator;
    readonly draftsTab: Locator;
    readonly historyTab: Locator;       
    readonly purchaseRequestModal: Locator;
    readonly closeModalButton: Locator;
    readonly cartEmptyMessage: Locator;
    readonly submitPRButton: Locator;
    readonly dismissButton: Locator;
    readonly addSelectedButton: Locator;
    readonly requestsCount: Locator;
    readonly purchaseRequestsTable: Locator;
    readonly noDataFoundMessage: Locator;
    readonly purchaseRequestNavTab: Locator;
    readonly draftPR: Locator;
    readonly idSort: Locator;
    readonly requestedBySort: Locator;
    readonly qtySort: Locator;
    readonly totalPriceSort: Locator;
    readonly dateCreatedSort: Locator;
    
    //=====================Variables====================
    readonly catalogUrl: string = "https://hub-surgia-test.dentacartscloud.net/catalog";
    
    //=====================Constructor==================
    constructor(page: Page) {
        this.page = page;
        
        // Initialize Catalog Page Locators
        this.searchInput = page.getByRole('textbox', { name: 'Search' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.cartButton = page.locator("//button[@class='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors relative']");
        this.brandFilter3M = page.locator("//div[contains(text(),'3M')]");
        this.brandFilterIBI = page.locator("//div[contains(text(),'IBI')]");
        this.priceRangeMin = page.getByRole('spinbutton').first();
        this.priceRangeMax = page.getByRole('spinbutton').last();
        this.resetFiltersButton = page.getByRole('button', { name: 'Reset' });
        this.productsHeading = page.getByRole('heading', { name: 'Products' });
        this.noProductsFoundMessage = page.getByRole('heading', { name: 'No products found' });
        this.filtersButton = page.getByRole('button', { name: 'filter Filters' });
        this.catalogBranchSelector = page.locator("//select[contains(@class,'branch-selector')]");
        this.addToCartButton = page.getByRole('button', { name: /Add to Cart/i });
        this.cartSubmitPR = page.getByText('Submit purchase request (PR)');
        
        // Initialize Product Page Locators
        this.productCard = page.locator("//div[contains(@class,'product-card')]");
        this.productName = page.locator("//h3[contains(@class,'product-name')]");
        this.productPrice = page.locator("//div[contains(@class,'product-price')]");
        this.addToCartPR = page.getByRole('button', { name: /Add to PR/i });
        this.productImage = page.locator("//img[contains(@class,'product-image')]");
        this.productDescription = page.locator("//p[contains(@class,'product-description')]");
        this.variantSelector = page.locator("//select[contains(@class,'variant-selector')]");
        this.quantityInput = page.locator("(//input[@type='text'])[2]");
        this.productModal = page.locator("//div[contains(@class,'product-modal')]");
        this.modalAddToCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.cartIcon = page.locator("//button[contains(@class,'cart-icon')]");
        this.cartItemCount = page.locator("//span[contains(@class,'cart-count')]");
        this.firstVariantColor = page.locator("//button[contains(text(),'Black')]");
        this.firstVariantSize = page.locator("//button[contains(text(),'1 g')]");
        this.secondVariantColor = page.locator("//button[contains(text(),'white')]");
        this.secondVariantSize = page.locator("//button[contains(text(),'1 g')]");
        this.itemAddToPR = page.getByText('Item quantity updated successfully');
        this.modalCloseButton = page.locator("//img[@alt='Close']");
        
        // Initialize Purchase Request Page Locators
        this.createPOButton = page.getByRole('button', { name: /Create PO/i });
        this.purchaseRequestBranchSelector = page.locator("//select[contains(@class,'branch-selector')]");
        this.submittedTab = page.locator("(//button[@type='button'])[2]");
        this.draftsTab = page.locator("//button[contains(text(),'Drafts')]");
        this.historyTab = page.locator("(//button[@type='button'])[4]");
        this.purchaseRequestModal = page.locator("//div[contains(@class,'modal')]//h2[text()='Purchase request']");
        this.closeModalButton = page.getByRole('button', { name: 'Close' });
        this.cartEmptyMessage = page.locator("//p[text()='Your cart is empty']");
        this.submitPRButton = page.getByRole('button', { name: 'Submit purchase request (PR)' });
        this.dismissButton = page.getByRole('button', { name: 'Dismiss' });
        this.addSelectedButton = page.getByRole('button', { name: 'Add Selected' });
        this.requestsCount = page.locator("//div[contains(text(),'requests')]");
        this.purchaseRequestsTable = page.locator("//table");
        this.noDataFoundMessage = page.locator("//td[text()='No Data found']");
        this.purchaseRequestNavTab = page.getByRole('link', { name: 'Purchase Requests' }); 
        this.draftPR = page.locator("//p[contains(text(),'new@mailna.co')]");
        this.idSort = page.getByRole('cell', { name: 'ID sort' });
        this.requestedBySort = page.getByText('Requested By');
        this.qtySort = page.getByRole('cell', { name: 'Qty sort' });
        this.totalPriceSort = page.getByRole('cell', { name: 'Total Price (RS) sort' });
        this.dateCreatedSort = page.getByRole('cell', { name: 'Date Created sort' });
    }
    
    //=====================Catalog Page Methods======================
    async openCatalog() {
        await this.page.goto(this.catalogUrl);
    }
    
    async openCart() {
        await this.cartButton.click();
    }
    
    async clickSubmitPR() {
        await this.cartSubmitPR.click();
    }
    
    async clickAddToCart(productIndex: number = 0) {
        const addToCartButtons = this.page.locator("//button[contains(text(),'Add to Cart')]");
        await addToCartButtons.nth(productIndex).click();
    }
    
    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.page.keyboard.press('Enter');
    }
    
    async clearSearch() {
        await this.searchInput.clear();
        await this.page.keyboard.press('Enter');
    }
    
    async selectBrand(brandName: string) {
        if (brandName.toLowerCase() === '3m') {
            await this.brandFilter3M.click();
        } else if (brandName.toLowerCase() === 'ibi') {
            await this.brandFilterIBI.click();
        }
    }
    
    async setPriceRange(minPrice: string, maxPrice: string) {
        if (minPrice) {
            await this.priceRangeMin.fill(minPrice);
        }
        if (maxPrice) {
            await this.priceRangeMax.fill(maxPrice);
        }
    }
    
    async resetFilters() {
        await this.resetFiltersButton.click();
    }
    
    async selectCatalogBranch(branchName: string) {
        await this.catalogBranchSelector.selectOption(branchName);
    }
    
    async assertNoProductsFound() {
        await expect(this.noProductsFoundMessage).toBeVisible();
    }
    
    async assertProductsFound() {
        await expect(this.noProductsFoundMessage).not.toBeVisible();
    }
    
    async waitForProductsToLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    //=====================Product Page Methods======================
    async clickProductCard(productIndex: number = 0) {
        const productCards = this.page.locator("//div[contains(@class,'product-card')]");
        await productCards.nth(productIndex).click();
    }
    
    async selectVariant() {
        await this.firstVariantColor.click();
        await this.firstVariantSize.click();
        await this.quantityInput.fill('5');
        await this.addToCartPR.click();
        await expect(this.itemAddToPR).toBeVisible();
        await this.secondVariantColor.click();
        await this.secondVariantSize.click();
        await this.quantityInput.fill('5');
        await this.addToCartPR.click();
        await expect(this.itemAddToPR).toBeVisible();
    }
    
    async setQuantity(quantity: string) {
        await this.quantityInput.fill(quantity);
    }
    
    async openProductModal(productIndex: number = 0) {
        await this.clickProductCard(productIndex);
    }
    
    async closeProductModal() {
        await this.modalCloseButton.click();
    }
    
    async addToCartFromModal() {
        await this.modalAddToCartButton.click();
    }
    
    async assertProductModalVisible() {
        await expect(this.productModal).toBeVisible();
    }
    
    async assertProductModalHidden() {
        await expect(this.productModal).not.toBeVisible();
    }
    
    async assertCartItemCount(expectedCount: string) {
        await expect(this.cartItemCount).toContainText(expectedCount);
    }
    
    async waitForProductModal() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async getProductName(productIndex: number = 0) {
        const productNames = this.page.locator("//h3[contains(@class,'product-name')]");
        return await productNames.nth(productIndex).textContent();
    }
    
    async getProductPrice(productIndex: number = 0) {
        const productPrices = this.page.locator("//div[contains(@class,'product-price')]");
        return await productPrices.nth(productIndex).textContent();
    }
    
    async assertProductVisible(productName: string) {
        const product = this.page.locator(`//h3[contains(text(),'${productName}')]`);
        await expect(product).toBeVisible();
    }
    
    async assertProductNotVisible(productName: string) {
        const product = this.page.locator(`//h3[contains(text(),'${productName}')]`);
        await expect(product).not.toBeVisible();
    }
    
    //=====================Purchase Request Page Methods======================
    async clickCreatePO() {
        await this.createPOButton.click();
    }
    
    async selectPurchaseRequestBranch(branchName: string) {
        await this.purchaseRequestBranchSelector.selectOption(branchName);
    }
    
    async clickSubmittedTab() {
        await this.submittedTab.click();
    }
    
    async clickDraftsTab() {
        await this.draftsTab.click();
    }
    
    async clickHistoryTab() {
        await this.historyTab.click();
    }
    
    async closeModal() {
        await this.closeModalButton.click();
    }
    
    async assertModalIsVisible() {
        await expect(this.purchaseRequestModal).toBeVisible();
    }
    
    async assertModalIsHidden() {
        await expect(this.purchaseRequestModal).not.toBeVisible();
    }
    
    async assertCartEmpty() {
        await expect(this.cartEmptyMessage).toBeVisible();
    }
    
    async assertSubmitButtonDisabled() {
        await expect(this.submitPRButton).toBeDisabled();
    }
    
    async assertSubmitButtonEnabled() {
        await expect(this.submitPRButton).toBeEnabled();
    }
    
    async assertNoRequests() {
        await expect(this.requestsCount).toContainText('0 requests');
    }
    
    async assertNoDataFound() {
        await expect(this.noDataFoundMessage).toBeVisible();
    }
    
    async waitForModalToLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForRequestsToLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    //=====================Common Methods======================
    async selectBranch(branchName: string) {
        // This method can be used for any branch selector on the page
        await this.catalogBranchSelector.selectOption(branchName);
    }
    
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}
