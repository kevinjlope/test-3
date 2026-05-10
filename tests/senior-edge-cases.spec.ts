import { test, expect } from '@playwright/test';

test.describe('Fifty Flowers: Senior Edge Cases', () => {

  test('Rollback Simulation with ?fail=1 on Creation', async ({ page }) => {
    await page.goto('/products/new?fail=1');
    
    await page.fill('input#name', 'Failure Test Product');
    await page.fill('input[name="price"]', '10');
    await page.fill('input[name="stockQuantity"]', '5');
    await page.fill('textarea[name="description"]', 'Description for failure test.');
    
    await page.getByPlaceholder(/Paste image URL here/i).fill('https://picsum.photos/seed/fail/400/300');
    // Ensure button is clickable
    const addButton = page.getByRole('button', { name: /Add/i, exact: true });
    await addButton.click();
    
    // Wait for the image preview and alt text input to appear
    const altInput = page.getByPlaceholder(/Describe the image/i);
    await altInput.waitFor({ state: 'visible' });
    await altInput.fill('Fail image');
    
    await page.getByRole('button', { name: 'Create Product' }).click();
    
    // It should stay on the page and show the simulated error
    await expect(page.getByText(/Simulated server error for rollback testing/i)).toBeVisible();
    await expect(page).toHaveURL(/\/products\/new\?fail=1/);
  });

  test('Rollback Simulation with ?fail=1 on Soft Delete', async ({ page }) => {
    await page.goto('/');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    const productName = await productCard.locator('h3').innerText();
    
    await page.goto('/?fail=1');
    
    const targetCard = page.locator('[data-testid="product-card"]').filter({ hasText: productName });
    await targetCard.hover();
    
    await targetCard.getByRole('button', { name: /Delete/i }).click();
    await page.getByRole('button', { name: 'Confirm Delete' }).click();
    
    await expect(page.getByText(/Simulated rollback error/i)).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible();
  });
});
