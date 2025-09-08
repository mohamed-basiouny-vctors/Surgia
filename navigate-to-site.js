const { chromium } = require('playwright');

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false });
  
  // Create a new context
  const context = await browser.newContext();
  
  // Open a new page
  const page = await context.newPage();
  
  // Navigate to the URL
  console.log('Navigating to SURGiA login page...');
  await page.goto('https://admin-surgia-tst.dentacartscloud.net/en/auth/signin?callbackUrl=%2Fen%2Fdashboard%2Frequests%2F27');
  
  // Keep the browser open
  console.log('Navigation complete. Browser will stay open until you press Ctrl+C');
})().catch(err => {
  console.error('An error occurred:', err);
  process.exit(1);
}); 