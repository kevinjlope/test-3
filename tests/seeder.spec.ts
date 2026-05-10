import { test, expect } from '@playwright/test';

/**
 * Playwright "Seeder" & E2E Suite
 * This test suite creates real products with consistent data to demo the app.
 */
test.describe('Fifty Flowers: Catalog Seeder & E2E', () => {

  const flowerData = [
    {
      name: 'Sahara Sensation Roses',
      price: '52.00',
      stock: '60',
      category: 'Roses',
      unit: 'Bunch',
      description: 'A stunning sandy-peach rose that exudes elegance. Its muted tones make it a favorite for vintage-themed weddings and sophisticated events.',
      imageUrl: 'https://images.pexels.com/photos/56866/garden-rose-rose-red-flower-56866.jpeg?auto=compress&cs=tinysrgb&w=800',
      altText: 'Elegant peach-colored Sahara roses'
    },
    {
      name: 'Double Late Pink Tulips',
      price: '18.50',
      stock: '200',
      category: 'Tulips',
      unit: 'Bunch',
      description: 'These tulips are often mistaken for peonies due to their high petal count. A soft, romantic pink that blooms beautifully in late spring.',
      imageUrl: 'https://images.pexels.com/photos/1003914/pexels-photo-1003914.jpeg?auto=compress&cs=tinysrgb&w=800',
      altText: 'Lush pink double late tulips'
    },
    {
      name: 'Autumn Gold Sunflowers',
      price: '3.25',
      stock: '500',
      category: 'Sunflowers',
      unit: 'Stem',
      description: 'Classic fall sunflowers with dark centers and bright golden petals. These stems are sturdy and long-lasting.',
      imageUrl: 'https://images.pexels.com/photos/1390433/pexels-photo-1390433.jpeg?auto=compress&cs=tinysrgb&w=800',
      altText: 'Tall golden sunflower with dark center'
    },
    {
      name: 'Antique Pink Hydrangeas',
      price: '42.00',
      stock: '30',
      category: 'Hydrangeas',
      unit: 'Stem',
      description: 'Large, heirloom-quality hydrangea heads with a unique dusty pink and green antique finish. Perfect as a focal point.',
      imageUrl: 'https://images.pexels.com/photos/4221156/pexels-photo-4221156.jpeg?auto=compress&cs=tinysrgb&w=800',
      altText: 'Large dusty pink antique hydrangea bloom'
    }
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const flower of flowerData) {
    test(`Seed Product: ${flower.name}`, async ({ page }) => {
      // 1. Check if product already exists to avoid Async Validation error timeout
      const existingProduct = page.locator('h3').filter({ hasText: flower.name });
      if (await existingProduct.isVisible()) {
          console.log(`Skipping ${flower.name} as it already exists.`);
          return;
      }

      // 2. Navigate to New Product
      await page.getByRole('link', { name: 'Add Product' }).click();
      await expect(page).toHaveURL(/\/products\/new/);

      // 3. Fill Basic Info
      await page.fill('input#name', flower.name);
      await page.fill('input[name="price"]', flower.price);
      await page.fill('input[name="stockQuantity"]', flower.stock);
      await page.fill('textarea[name="description"]', flower.description);
      
      // 4. Select Category and Unit
      await page.locator('button#category').click();
      await page.getByRole('option', { name: flower.category }).click();

      await page.locator('button#unitOfSale').click();
      await page.getByRole('option', { name: flower.unit }).click();

      // 5. Add Real Image URL
      await page.getByRole('tab', { name: /From URL/i }).click();
      await page.getByPlaceholder(/Paste image URL here/i).fill(flower.imageUrl);
      await page.getByRole('button', { name: /Add/i, exact: true }).click();

      // 6. Fill Alt Text
      const altTextInput = page.getByPlaceholder(/Describe the image/i);
      await altTextInput.waitFor();
      await altTextInput.fill(flower.altText);

      // 7. Submit
      await page.getByRole('button', { name: 'Create Product' }).click();
      
      // 8. Verify
      await page.waitForURL('/');
      await page.getByPlaceholder(/Search products/i).fill(flower.name);
      await expect(page.locator('h3').filter({ hasText: flower.name })).toBeVisible();
    });
  }

  test('Cleanup: Verify all seeded products exist in list', async ({ page }) => {
    await page.goto('/');
    for (const flower of flowerData) {
      await expect(page.locator('h3').filter({ hasText: flower.name })).toBeVisible();
    }
  });
});
