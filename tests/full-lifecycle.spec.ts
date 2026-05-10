import { test, expect } from '@playwright/test';

/**
 * Comprehensive E2E Suite for Fifty Flowers Product Management
 */
test.describe('Fifty Flowers: Full Product Lifecycle', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Search and Filtering Flow', async ({ page }) => {
    // 1. Search by name
    const searchInput = page.getByPlaceholder(/Search products/i);
    await searchInput.fill('Rose');
    // We wait for the URL to change instead of a hard timeout
    await page.waitForURL(/q=Rose/);
    await expect(page).toHaveURL(/q=Rose/);

    // 2. Multi-select category filtering
    // Let's use a more specific selector to avoid matching product names
    const filterSection = page.locator('aside, .filter-section, [data-testid="category-filter"]');
    const rosesFilter = page.getByRole('checkbox', { name: /Roses/i });
    
    if (await rosesFilter.isVisible()) {
      await rosesFilter.click();
      await page.waitForURL(/category=roses/);
      await expect(page).toHaveURL(/category=roses/);
    }
  });

  test('Full CRUD Flow: Create, Edit, and Soft-Delete', async ({ page }) => {
    const productName = `Test Product ${Date.now()}`;

    // --- CREATE ---
    await page.getByRole('link', { name: 'Add Product' }).click();
    await expect(page).toHaveURL(/\/products\/new/);

    await page.fill('input#name', productName);
    await page.fill('input[name="price"]', '12.50');
    await page.fill('input[name="stockQuantity"]', '100');
    await page.fill('textarea[name="description"]', 'This is a comprehensive test description for the flower product.');
    
    // Select Unit of Sale (shadcn Select)
    await page.locator('button#unitOfSale').click();
    await page.getByRole('option', { name: 'Bunch' }).click();

    // Select Category (shadcn Select)
    await page.locator('button#category').click();
    await page.getByRole('option', { name: 'Roses' }).click();

    // Add Image via ImageDropzone.tsx
    const imageUrl = 'https://picsum.photos/seed/rose/800/600';
    await page.getByPlaceholder(/Paste image URL here/i).fill(imageUrl);
    await page.getByRole('button', { name: /Add/i, exact: true }).click();

    // Fill Alt Text for the added image
    const altTextInput = page.getByPlaceholder(/Describe the image/i);
    await altTextInput.waitFor();
    await altTextInput.fill('Beautiful Test Rose');

    await page.getByRole('button', { name: 'Create Product' }).click();
    await page.waitForURL('/');
    await expect(page.getByText(productName)).toBeVisible();

    // --- EDIT ---
    // Search for it first to be sure it's visible
    await page.getByPlaceholder(/Search products/i).fill(productName);
    await page.waitForTimeout(500);

    const productCard = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await productCard.hover(); // Make buttons visible
    await productCard.getByRole('link', { name: /Edit/i }).click();
    
    const updatedName = `${productName} Updated`;
    await page.fill('input#name', updatedName);
    await page.getByRole('button', { name: 'Update Product' }).click();
    
    await page.waitForURL('/');
    await page.getByPlaceholder(/Search products/i).fill(updatedName);
    await expect(page.getByText(updatedName)).toBeVisible();

    // --- DELETE (SOFT DELETE) ---
    const updatedCard = page.locator('[data-testid="product-card"]').filter({ hasText: updatedName });
    await updatedCard.hover();
    
    // We handle the native confirm() dialog
    page.once('dialog', dialog => dialog.accept());
    await updatedCard.getByRole('button', { name: /Delete/i }).click();

    // Verify it's gone
    await expect(page.getByText(updatedName)).not.toBeVisible();

    // --- UNDO ---
    const undoButton = page.getByRole('button', { name: /Undo/i });
    if (await undoButton.isVisible()) {
      await undoButton.click();
      await expect(page.getByText(updatedName)).toBeVisible();
    }
  });

  test('Responsive Design: Mobile View', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();
  });

  test('Form Edge Cases: Async Validation & Uniqueness', async ({ page }) => {
    await page.goto('/products/new');
    
    // Fill with an existing name (we know "Fresh Red Roses" is likely in the DB)
    await page.fill('input#name', 'Fresh Red Roses');
    await page.fill('input[name="price"]', '10');
    await page.fill('input[name="stockQuantity"]', '10');
    await page.fill('textarea[name="description"]', 'Valid description here.');
    
    // Add an image to pass Zod min(1)
    await page.getByPlaceholder(/Paste image URL here/i).fill('https://picsum.photos/seed/test/400/300');
    await page.getByRole('button', { name: /Add/i, exact: true }).click();
    await page.getByPlaceholder(/Describe the image/i).fill('Alt text');
    
    await page.getByRole('button', { name: 'Create Product' }).click();
    
    // Check for uniqueness error
    await expect(page.getByText(/Product name must be unique/i)).toBeVisible();
  });
});
