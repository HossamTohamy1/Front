const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Check if the server is reachable
    console.log('Navigating to http://127.0.0.1:4200...');
    const response = await page.goto('http://127.0.0.1:4200', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Status code:', response.status());
    
    // Log console messages to see any i18n errors
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // Wait for the app to render
    await page.waitForTimeout(5000);
    
    console.log('Extracting text from page...');
    const textContent = await page.evaluate(() => document.body.innerText);
    
    // Look for our keys or translated text
    const keysToCheck = [
      'STOREFRONT.AUTO_STR_244', 'فلترة حسب النوع', 'Filter by type',
      'PRODUCTS.ALL_SHAPERS', 'كل المشدات', 'All Shapers',
      'CATEGORIES.SHAPERS', 'مشدات', 'Shapers',
      'STOREFRONT.AUTO_STR_39',
      'HOME.SHOP_BY_CATEGORY'
    ];
    
    for (const key of keysToCheck) {
      if (textContent.includes(key)) {
        console.log(`FOUND TEXT: "${key}"`);
      }
    }
    
    // Also check network requests for ar.json
    console.log('Checking if ar.json was requested...');
    // We didn't setup a request interceptor early enough, let's reload and trace network
    let arJsonStatus = 'Not requested';
    page.on('response', resp => {
      if (resp.url().includes('ar.json') || resp.url().includes('en.json')) {
        console.log(`FETCHED: ${resp.url()} [${resp.status()}]`);
        arJsonStatus = `Requested with status ${resp.status()}`;
      }
    });
    
    console.log('Reloading to catch network requests...');
    await page.goto('http://127.0.0.1:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Try to switch language if there is a button
    // The language switcher might be in the header. We can search for 'English' or 'العربية'
    console.log('Trying to switch language...');
    const langBtn = await page.$('text="English"');
    if (langBtn) {
      await langBtn.click();
      await page.waitForTimeout(3000);
      const enTextContent = await page.evaluate(() => document.body.innerText);
      console.log('EN text check for "All Shapers":', enTextContent.includes('All Shapers'));
    }
    
    console.log('Done.');
  } catch (err) {
    console.error('Error during scrape:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
