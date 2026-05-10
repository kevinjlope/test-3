import { describe, it, expect } from 'vitest';
import { productSchema } from './ProductForm';

describe('Product Validation Schema', () => {
  const validProduct = {
    name: 'Fresh Red Roses',
    price: 15.99,
    stockQuantity: 50,
    unitOfSale: 'bunch',
    category: 'roses',
    description: 'Beautiful long-stemmed red roses, fresh from the farm.',
    images: [
      { id: '1', url: 'https://example.com/rose.jpg', altText: 'Red rose' }
    ]
  };

  it('should validate a correct product (Happy Path)', () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  describe('Name Validation', () => {
    it('should fail if name is too short', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'Ab' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters');
      }
    });

    it('should fail if name is too long', () => {
      const result = productSchema.safeParse({ ...validProduct, name: 'a'.repeat(81) });
      expect(result.success).toBe(false);
    });
  });

  describe('Price and Stock Validation', () => {
    it('should fail if price is less than 0.01', () => {
      const result = productSchema.safeParse({ ...validProduct, price: 0 });
      expect(result.success).toBe(false);
    });

    it('should fail if stock is negative', () => {
      const result = productSchema.safeParse({ ...validProduct, stockQuantity: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe('Image Validation', () => {
    it('should fail if there are no images', () => {
      const result = productSchema.safeParse({ ...validProduct, images: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one image');
      }
    });

    it('should fail if image url is invalid', () => {
      const result = productSchema.safeParse({
        ...validProduct,
        images: [{ id: '1', url: 'not-a-url', altText: 'text' }]
      });
      expect(result.success).toBe(false);
    });

    it('should fail if image alt text is missing', () => {
      const result = productSchema.safeParse({
        ...validProduct,
        images: [{ id: '1', url: 'https://example.com/img.jpg', altText: '' }]
      });
      expect(result.success).toBe(false);
    });
  });
});
