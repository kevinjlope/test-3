import { test, expect } from '@playwright/test';

test.describe('Fifty Flowers: Advanced Features', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Sorting by Price and Name', async ({ page }) => {
    // 1. Sort by Price (Low to High)
    const sortTrigger = page.locator('button[data-slot="select-trigger"]').filter({ hasText: /Newest First|Oldest First|Name|Price/i });
    await sortTrigger.click();
    
    await page.locator('[data-slot="select-item"]').filter({ hasText: 'Price (Low to High)' }).click();
    
    await page.waitForURL(/sortBy=price&sortOrder=asc/);
    await page.waitForTimeout(1000); 
    
    const priceLocators = page.locator('[data-testid="product-card"]').locator('span').filter({ hasText: '$' });
    const prices = await priceLocators.allInnerTexts();
    const numericPrices = prices.map(p => {
      const match = p.match(/\d+\.\d+/);
      return match ? parseFloat(match[0]) : 0;
    }).filter(p => p > 0);
    
    expect(numericPrices.length).toBeGreaterThan(0);
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);

    // 2. Sort by Name (Z-A)
    await sortTrigger.click();
    await page.locator('[data-slot="select-item"]').filter({ hasText: 'Name (Z-A)' }).click();
    
    await page.waitForURL(/sortBy=name&sortOrder=desc/);
    await page.waitForTimeout(1000);

    const names = await page.locator('[data-testid="product-card"] h3').allInnerTexts();
    expect(names.length).toBeGreaterThan(0);
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sortedNames);
  });

  test('Persistence of Image Reordering', async ({ page }) => {
    // We'll use a product we know exists from initial seeding
    const productName = 'Freedom Red Roses';
    
    await page.getByPlaceholder(/Search products/i).fill(productName);
    const card = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await expect(card).toBeVisible();
    await card.hover();
    await card.getByRole('link', { name: /Edit/i }).click();
    
    // Use specific locator for h1
    await expect(page.locator('h1', { hasText: 'Edit Product' })).toBeVisible();

    let handleCount = await page.getByTestId('drag-handle').count();
    
    if (handleCount < 2) {
      const secondImageUrl = 'https://picsum.photos/seed/reorder3/800/600';
      await page.getByPlaceholder(/Paste image URL here/i).fill(secondImageUrl);
      await page.getByRole('button', { name: /Add/i, exact: true }).click();
      await expect(page.getByTestId('drag-handle')).toHaveCount(handleCount + 1);
      await page.getByPlaceholder(/Describe the image/i).last().fill('Second Test Image');
    }

    const handles = page.getByTestId('drag-handle');
    const firstHandle = handles.nth(0);
    const secondHandle = handles.nth(1);

    const firstImg = page.locator('img').nth(0);
    const srcBefore = await firstImg.getAttribute('src');

    const firstBox = await firstHandle.boundingBox();
    const secondBox = await secondHandle.boundingBox();

    if (firstBox && secondBox) {
        await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2, { steps: 15 });
        await page.mouse.up();
    }
    
    await page.waitForTimeout(1000); 

    await page.getByRole('button', { name: /Update Product/i }).click();
    await page.waitForURL('/');

    await page.getByPlaceholder(/Search products/i).fill(productName);
    await card.hover();
    await card.getByRole('link', { name: /Edit/i }).click();

    const srcAfter = await page.locator('img').nth(0).getAttribute('src');
    expect(srcAfter).not.toBe(srcBefore);
  });
});
