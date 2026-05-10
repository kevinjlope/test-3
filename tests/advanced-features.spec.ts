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
    
    // Wait for URL and some time for re-render
    await page.waitForURL(/sortBy=price&sortOrder=asc/);
    await page.waitForTimeout(1000); 
    
    // Get all prices to verify order
    const priceLocators = page.locator('[data-testid="product-card"] span').filter({ hasText: '$' });
    const prices = await priceLocators.allInnerTexts();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    
    expect(numericPrices.length).toBeGreaterThan(0);
    // Sort verification: numericPrices should be non-decreasing
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
    const productName = 'Freedom Red Roses';
    
    await page.getByPlaceholder(/Search products/i).fill(productName);
    const card = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    // If not found, skip or create (but we assume seeder ran)
    if (!(await card.isVisible())) {
       console.log('Skipping reorder test as product not found');
       return;
    }

    await card.hover();
    await card.getByRole('link', { name: /Edit/i }).click();
    
    // Wait for the edit page to load
    await expect(page.getByText(/Edit Product/i)).toBeVisible();

    // Ensure we have at least 2 images by checking the drag handles
    let handleCount = await page.getByTestId('drag-handle').count();
    
    if (handleCount < 2) {
      await page.getByRole('tab', { name: /From URL/i }).click();
      const secondImageUrl = 'https://picsum.photos/seed/reorder3/800/600';
      await page.getByPlaceholder(/Paste image URL here/i).fill(secondImageUrl);
      await page.getByRole('button', { name: /Add/i, exact: true }).click();
      
      // Wait for the new image handle to appear
      await expect(page.getByTestId('drag-handle')).toHaveCount(handleCount + 1);
      
      // Fill the Alt Text for the NEWLY added image (it's the last one)
      await page.getByPlaceholder(/Describe the image/i).last().fill('Second Test Image');
    }

    // Perform Drag and Drop with manual mouse movements for dnd-kit
    const handles = page.getByTestId('drag-handle');
    const firstHandle = handles.nth(0);
    const secondHandle = handles.nth(1);

    const firstImg = page.locator('img').nth(0);
    const srcBefore = await firstImg.getAttribute('src');

    // Trigger drag and drop
    const firstBox = await firstHandle.boundingBox();
    const secondBox = await secondHandle.boundingBox();

    if (firstBox && secondBox) {
        await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2, { steps: 15 });
        await page.mouse.up();
    }
    
    await page.waitForTimeout(1000); 

    // 4. Save Changes
    await page.getByRole('button', { name: /Update Product/i }).click();
    await page.waitForURL('/');

    // 5. Verify Persistence
    await page.getByPlaceholder(/Search products/i).fill(productName);
    const finalCard = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await finalCard.hover();
    await finalCard.getByRole('link', { name: /Edit/i }).click();

    const srcAfter = await page.locator('img').nth(0).getAttribute('src');
    expect(srcAfter).not.toBe(srcBefore);
  });
});
