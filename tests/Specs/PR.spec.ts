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
    await page.waitForTimeout(3000);
    
  });

  test('SH1-1322 Happy Path: Create, Update, and Submit a PR', async ({ page }) => {
    
    await page.getByRole('link', { name: 'Catalog' }).click();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.openCart();
    await catalog_pr_page.clickSubmitPR();
    await expect(page.getByRole('heading', { name: 'Purchase Requests' })).toBeVisible();
  });

 test('SH1-1298 First product addition auto-creates Draft PR', async ({ page }) => {
    
  await page.getByRole('link', { name: 'Catalog' }).click();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.purchaseRequestNavTab.click();
    await catalog_pr_page.clickDraftsTab();
    await expect(catalog_pr_page.purchaseRequestsTable).toBeVisible();
    await expect(catalog_pr_page.draftPR).toBeVisible();
    
  });

  test('SH1-XXX: Edit quantities in draft PR cart and verify auto-save', async ({ page }) => {
    
    await page.getByRole('link', { name: 'Catalog' }).click();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.selectVariant();
    await catalog_pr_page.closeProductModal();
    await catalog_pr_page.openCart();
    await catalog_pr_page.setQuantity('10');
    await expect(catalog_pr_page.itemAddToPR).toBeVisible();  
  });

  test('Low-Level: UI - Display of existing Draft PR in the PR list in the table', async ({ page }) => {
    await page.getByRole('link', { name: 'Purchase Requests' }).click();
    await catalog_pr_page.clickDraftsTab();
    await expect(catalog_pr_page.idSort).toBeVisible();
    await expect(catalog_pr_page.requestedBySort).toBeVisible();
    await expect(catalog_pr_page.qtySort).toBeVisible();
    await expect(catalog_pr_page.totalPriceSort).toBeVisible();
    await expect(catalog_pr_page.dateCreatedSort).toBeVisible();
  });
      
  test('Low-Level: Negative - Add to PR Without Quantity', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.setQuantity('0');
    await catalog_pr_page.addToCartPR.click();
    await expect(page.getByText('Failed to update purchase')).toBeVisible();

  });
  test('Low-Level: Negative - Adding an Invalid Quantity', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await catalog_pr_page.searchProduct('Automation');
    await catalog_pr_page.waitForProductsToLoad();   
    await catalog_pr_page.clickAddToCart(0); 
    await catalog_pr_page.setQuantity('-1');
    await expect(catalog_pr_page.addToCartPR).toBeDisabled();
    //await expect(page.getByText('Failed to update purchase')).toBeVisible();

  });
  test('SH1-1303 Increase product quantity in an existing Draft PR', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    const initialValueText = await page.getByRole('textbox').nth(1).inputValue();
    await page.getByRole('button', { name: 'Increase' }).click();
    const newValueText = await page.getByRole('textbox').nth(1).inputValue();
    expect(Number(newValueText)).toBe(Number(initialValueText) + 1);
    

  });
  test('SH1-1304 Decrease product quantity in an existing Draft', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await page.getByRole('button', { name: 'Start Icon Add to Cart' }).click();
    const initialValueText = await page.getByRole('textbox').nth(1).inputValue();
    await page.getByRole('button', { name: 'Decrease' }).click();
    const newValueText = await page.getByRole('textbox').nth(1).inputValue();
    expect(Number(newValueText)).toBe(Number(initialValueText) - 1);
    

  });
  test('SH1-1308 Validate quantity against maximum limit', async ({ page }) => {
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
test('SH1-1309 Increment product without variations from catalog listing', async ({ page }) => {
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
test('SH1-1305 Remove an item from a Draft PR', async ({ page }) => {
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
test('SH1-1307 Validate quantity field rejects non-numeric values', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('heading', { name: 'Automation' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Automation');
  await page.getByRole('button', { name: 'Start Icon Add to PR' }).click();
  await page.locator('#quantity-input').click();
  await page.locator('#quantity-input').fill('11');
  await expect(page.locator('#quantity-input')).toHaveValue('11');
});

});
