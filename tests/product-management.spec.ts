import { test, expect } from '@playwright/test';

test.describe('Product Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // We assume the app is running on localhost:5173 during tests
    await page.goto('/');
  });

  test('should display the product list and search', async ({ page }) => {
    // Check if the title or a main heading exists
    await expect(page).toHaveTitle(/Fifty Flowers/i);
    
    // The placeholder in CatalogSearch.tsx is "Search products..."
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    // Perform a search
    await searchInput.fill('Rose');
    // The debounce is 300ms, so we wait a bit
    await page.waitForTimeout(500);

    // Verify search works (URL should update)
    await expect(page).toHaveURL(/q=Rose/);
  });

  test('should navigate to create product page', async ({ page }) => {
    // The previous test failed because "Add" matched multiple things. 
    // We'll use the specific "Add Product" link which was listed in the error log.
    const createButton = page.getByRole('link', { name: 'Add Product' });
    await createButton.click();
    
    await expect(page).toHaveURL(/\/products\/new/);
  });

  test('should show validation errors on empty form submission', async ({ page }) => {
    await page.goto('/products/new');
    
    // In products.new.tsx, the label is explicitly passed as "Create Product"
    const saveButton = page.getByRole('button', { name: 'Create Product' });
    
    await saveButton.waitFor();
    await saveButton.click();

    // Check for some validation messages
    await expect(page.getByText(/Name must be at least 3 characters/i)).toBeVisible();
    await expect(page.getByText(/Price must be at least 0.01/i)).toBeVisible();
    await expect(page.getByText(/At least one image is required/i)).toBeVisible();
  });
});
