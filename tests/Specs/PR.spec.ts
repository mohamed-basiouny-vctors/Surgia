import { test, expect } from '@playwright/test';
import { Loginadmin } from '../pages/Tenantsigninpage';
import { Catalog_pr_page } from '../pages/Catalog_pr_page';
import { TIMEOUT } from 'dns';

let loginPage: Loginadmin;
let catalog_pr_page: Catalog_pr_page;

test.describe('Purchase Request Flow', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new Loginadmin(page);
    catalog_pr_page = new Catalog_pr_page(page);
    await loginPage.open();
    await loginPage.login("new@mailna.co", "123456");
    
  });

  /*test('SH1-XXX: Positive test - Complete purchase request flow with automation products', async ({ page }) => {
    
    await catalog_pr_page.openCatalog();
    await expect(page).toHaveURL(catalog_pr_page.catalogUrl);
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await page.waitForTimeout(2000);
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.openCart();
    await catalog_pr_page.clickSubmitPR();
    await expect(page.getByRole('heading', { name: 'Purchase Requests' })).toBeVisible();
  });

 test('SH1-XXX: High-Level: Positive - First Product Added to pr, Draft PR Created', async ({ page }) => {
    
    await catalog_pr_page.openCatalog();
    await expect(page).toHaveURL(catalog_pr_page.catalogUrl);
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await page.waitForTimeout(2000);
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.purchaseRequestNavTab.click();
    await catalog_pr_page.clickDraftsTab();
    await expect(catalog_pr_page.purchaseRequestsTable).toBeVisible();
    await expect(catalog_pr_page.draftPR).toBeVisible();
    
  });

  test('SH1-XXX: Edit quantities in draft PR cart and verify auto-save', async ({ page }) => {
    
    await catalog_pr_page.openCatalog();
    await expect(page).toHaveURL(catalog_pr_page.catalogUrl);
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await page.waitForTimeout(2000);
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.openCart();
    await catalog_pr_page.setQuantity('10');
    await expect(catalog_pr_page.itemAddToPR).toBeVisible();  
  });

  test('Low-Level: UI - Display of existing Draft PR in the PR list in the table', async ({ page }) => {
    await catalog_pr_page.purchaseRequestNavTab.click();
    await catalog_pr_page.clickDraftsTab();
    await expect(catalog_pr_page.idSort).toBeVisible();
    await expect(catalog_pr_page.requestedBySort).toBeVisible();
    await expect(catalog_pr_page.qtySort).toBeVisible();
    await expect(catalog_pr_page.totalPriceSort).toBeVisible();
    await expect(catalog_pr_page.dateCreatedSort).toBeVisible();
  });
      
  test('Low-Level: Negative - Add to PR Without Quantity', async ({ page }) => {
    await catalog_pr_page.openCatalog();
    await expect(page).toHaveURL(catalog_pr_page.catalogUrl);
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await page.waitForTimeout(2000);
    await catalog_pr_page.setQuantity('0');
    await catalog_pr_page.addToCartPR.click();
    await expect(page.getByText('Failed to update purchase')).toBeVisible();

  });
  test('Low-Level: Negative - Adding an Invalid Quantity', async ({ page }) => {
    await catalog_pr_page.openCatalog();
    await expect(page).toHaveURL(catalog_pr_page.catalogUrl);
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await page.waitForTimeout(2000);
    await catalog_pr_page.setQuantity('-1');
    await expect(catalog_pr_page.addToCartPR).toBeDisabled();
    //await expect(page.getByText('Failed to update purchase')).toBeVisible();

  });
  test('the increase button should increase the quantity by 1', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    const initialValueText = await page.getByRole('textbox').nth(1).inputValue();
    await page.getByRole('button', { name: 'Increase' }).click();
    const newValueText = await page.getByRole('textbox').nth(1).inputValue();
    expect(Number(newValueText)).toBe(Number(initialValueText) + 1);
    

  });
  test('the decrease button should decrease the quantity by 1', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    const initialValueText = await page.getByRole('textbox').nth(1).inputValue();
    await page.getByRole('button', { name: 'Decrease' }).click();
    const newValueText = await page.getByRole('textbox').nth(1).inputValue();
    expect(Number(newValueText)).toBe(Number(initialValueText) - 1);
    

  });
  test('add a product with max allowed quantity', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    await page.getByRole('button', { name: 'Black' }).click();
    await page.getByRole('button', { name: '1 g' }).click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).press('ControlOrMeta+a');
    await page.getByRole('textbox').nth(1).fill('101');
    await expect(page.getByText('Quantity cannot be more than')).toBeVisible();
  });
  test('add a product with min allowed quantity', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    await page.getByRole('button', { name: 'Black' }).click();
    await page.getByRole('button', { name: '1 g' }).click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).press('ControlOrMeta+a');
    await page.getByRole('textbox').nth(1).fill('1');
    await expect(page.getByText('Quantity cannot be more than')).toBeVisible();
  });
  test('Cart Icon Update', async ({ page }) => {
    await page.goto('https://hub-surgia-test.dentacartscloud.net/catalog');
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    await page.getByRole('button', { name: 'Increase' }).click();
    await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('button', { name: 'Cart 1' })).toBeVisible();
});
test('Low-Level: UI - Filters and Search Functionality with PR Creation', async ({ page }) => {
  await page.goto('https://hub-surgia-test.dentacartscloud.net/catalog');
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
  await page.getByRole('button', { name: 'Increase' }).click();
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('button', { name: 'Cart 1' })).toBeVisible();
});
test('Low-Level: UI - Pagination and PR Creation', async ({ page }) => {
await page.getByRole('link', { name: 'Catalog' }).click();
await expect(page.getByRole('button', { name: '1', exact: true })).toBeVisible();
await expect(page.locator('//button[normalize-space()="Next"]')).toBeVisible();
await expect(page.locator('//button[normalize-space()="Previous"]')).toBeVisible();
});
test('Low-Level: UI - Product price and currency display', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await expect(page.getByText('22SAR')).toBeVisible();
});
test('Low-Level: UI - Add to PR button for a product with no variants', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await expect(page.getByText('22SAR')).toBeVisible();
});
test('Low-Level: Missing - Adding a product when another Draft PR exists, but for a different branch', async ({ page }) => {
  await page.getByRole('link', { name: 'Purchase Requests' }).click();
  await page.getByRole('button', { name: 'Drafts' }).click();
  await expect(page.getByRole('cell', { name: 'new@mailna.co' }).getByRole('paragraph')).toBeVisible();
  await page.getByRole('combobox').selectOption('505');
  await expect(page.getByText('No Data found')).toBeVisible();
});
test('High-Level: Positive - Remove a single item from a multi-item PR', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
  await page.getByRole('button', { name: 'Black' }).click();
  await page.getByRole('button', { name: '1 g' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('20');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Cart 1' }).click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByRole('region', { name: 'Notifications alt+T' }).getByRole('listitem')).toBeVisible();
});
test('High-Level: Positive - Decrease Quantity in Draft PR', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.getByRole('button', { name: 'Increase' }).click();
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).nth(1).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Decrease' }).nth(1).click();
  await page.getByRole('button', { name: 'Increase' }).nth(1).click();
  await page.getByRole('button', { name: 'Decrease' }).nth(1).click();
  await page.getByText('Item quantity updated').click();
});
test('High-Level: Negative - Decrease quantity to 0', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).press('ControlOrMeta+a');
  await page.getByRole('textbox').nth(1).fill('0');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).nth(1).click();
  await page.getByText('Failed to update purchase').click();
});
test('enter special characters in quantity', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).press('ControlOrMeta+a');
  await page.getByRole('textbox').nth(1).fill('***');
  await expect(page.locator('addToPR=await page.locator("//button[@class="inline-flex items-center justify-center font-medium transition-colors focus:outline-none cursor-pointer rounded-md bg-primary text-white hover:bg-primary rounded-md px-4 py-2 text-sm opacity-50 cursor-not-allowed flex-1"]')).toBeDisabled();
});*/

});
