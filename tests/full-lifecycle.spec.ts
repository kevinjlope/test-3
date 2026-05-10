import { test, expect } from '@playwright/test';

/**
 * Comprehensive E2E Suite for Fifty Flowers Product Management
 */
test.describe('Fifty Flowers: Full Product Lifecycle', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Search and Filtering Flow', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search products/i);
    await searchInput.fill('Rose');
    await page.waitForURL(/q=Rose/);
    await expect(page).toHaveURL(/q=Rose/);

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
    
    await page.locator('button#unitOfSale').click();
    await page.getByRole('option', { name: 'Bunch' }).click();

    await page.locator('button#category').click();
    await page.getByRole('option', { name: 'Roses' }).click();

    // Select URL Tab
    await page.getByRole('tab', { name: /From URL/i }).click();
    const imageUrl = 'https://picsum.photos/seed/rose/800/600';
    await page.getByPlaceholder(/Paste image URL here/i).fill(imageUrl);
    await page.getByRole('button', { name: /Add/i, exact: true }).click();

    const altTextInput = page.getByPlaceholder(/Describe the image/i);
    await altTextInput.waitFor();
    await altTextInput.fill('Beautiful Test Rose');

    await page.getByRole('button', { name: 'Create Product' }).click();
    await page.waitForURL('/');
    // Use specific locator for card title to avoid ambiguity
    await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible();

    // --- EDIT ---
    await page.getByPlaceholder(/Search products/i).fill(productName);
    await page.waitForTimeout(500);

    const productCard = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await productCard.hover(); 
    await productCard.getByRole('link', { name: /Edit/i }).click();
    
    const updatedName = `${productName} Updated`;
    await page.fill('input#name', updatedName);
    await page.getByRole('button', { name: 'Update Product' }).click();
    
    await page.waitForURL('/');
    await page.getByPlaceholder(/Search products/i).fill(updatedName);
    await expect(page.locator('h3').filter({ hasText: updatedName })).toBeVisible();

    // --- DELETE (SOFT DELETE) ---
    const updatedCard = page.locator('[data-testid="product-card"]').filter({ hasText: updatedName });
    await updatedCard.hover();
    
    // Custom Dialog confirmation
    await updatedCard.getByRole('button', { name: /Delete/i }).click();
    // Button in AlertDialog is "Delete"
    await page.getByRole('button', { name: /^Delete$/ }).click();

    // Verify it's gone from the main list (using h3 to be safe)
    await expect(page.locator('h3').filter({ hasText: updatedName })).not.toBeVisible();

    // --- UNDO ---
    const undoButton = page.getByRole('button', { name: /Undo/i });
    if (await undoButton.isVisible()) {
      await undoButton.click();
      await expect(page.locator('h3').filter({ hasText: updatedName })).toBeVisible();
    }
  });

  test('Delete via Dropdown Menu (3 dots)', async ({ page }) => {
    const productName = 'Freedom Red Roses';
    
    // 1. Find product
    await page.getByPlaceholder(/Search products/i).fill(productName);
    const card = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await expect(card).toBeVisible();

    // 2. Open Dropdown
    await card.getByRole('button', { name: /Actions/i }).click();
    
    // 3. Click Delete in Dropdown
    await page.getByRole('menuitem', { name: /Delete/i }).click();

    // 4. Confirm in AlertDialog
    await page.getByRole('button', { name: /^Delete$/ }).click();

    // 5. Verify deletion
    await expect(page.locator('h3').filter({ hasText: productName })).not.toBeVisible();
  });

  test('Form Edge Cases: Async Validation & Uniqueness', async ({ page }) => {
    // Ensure we have a product to collide with
    const existingName = "Freedom Red Roses";
    
    await page.goto('/products/new');
    await page.fill('input#name', existingName);
    await page.fill('input[name="price"]', '10');
    await page.fill('input[name="stockQuantity"]', '10');
    await page.fill('textarea[name="description"]', 'Valid description here.');
    
    await page.getByRole('tab', { name: /From URL/i }).click();
    await page.getByPlaceholder(/Paste image URL here/i).fill('https://picsum.photos/seed/test/400/300');
    await page.getByRole('button', { name: /Add/i, exact: true }).click();
    await page.getByPlaceholder(/Describe the image/i).fill('Alt text');
    
    await page.getByRole('button', { name: 'Create Product' }).click();
    
    // Check for uniqueness error (this will fail if not handled by serverError feedback)
    await expect(page.getByText(/Product name must be unique/i)).toBeVisible();
  });
});
