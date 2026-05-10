import { cache } from 'react';
import { db } from '../db/client';
import { 
  products, 
  productImages, 
  type Product, 
  type NewProduct, 
  type ProductImage, 
  type NewProductImage,
  type Category
} from '../db/schema';
import { eq, and, isNull, like, inArray, desc, asc, sql, ne } from 'drizzle-orm';

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export const ProductService = {
  /**
   * Fetch products with optional filters.
   * Uses React.cache for per-request deduplication.
   */
  getProducts: cache(async (options: { 
    search?: string; 
    categories?: Category[]; 
    includeDeleted?: boolean 
  } = {}): Promise<ProductWithImages[]> => {
    const { search, categories, includeDeleted = false } = options;

    const conditions = [];
    if (!includeDeleted) {
      conditions.push(isNull(products.deletedAt));
    }
    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }
    if (categories && categories.length > 0) {
      conditions.push(inArray(products.category, categories));
    }

    const results = await db.select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt));

    if (results.length === 0) return [];

    const productIds = results.map(p => p.id);
    const allImages = await db.select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(asc(productImages.displayOrder));

    const imagesByProductId = allImages.reduce((acc, img) => {
      if (!acc[img.productId]) acc[img.productId] = [];
      acc[img.productId].push(img);
      return acc;
    }, {} as Record<string, ProductImage[]>);

    return results.map(p => ({
      ...p,
      images: imagesByProductId[p.id] || []
    }));
  }),

  /**
   * Fetch a single product by ID.
   * Uses React.cache for per-request deduplication.
   */
  getProductById: cache(async (id: string): Promise<ProductWithImages | null> => {
    const [product] = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) return null;

    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(asc(productImages.displayOrder));

    return {
      ...product,
      images
    };
  }),

  /**
   * Create a new product with its images.
   */
  createProduct: async (
    productData: NewProduct, 
    imagesData: Omit<NewProductImage, 'productId' | 'id'>[]
  ): Promise<ProductWithImages> => {
    return await db.transaction(async (tx) => {
      const [newProduct] = await tx.insert(products)
        .values(productData)
        .returning();

      let insertedImages: ProductImage[] = [];
      if (imagesData.length > 0) {
        insertedImages = await tx.insert(productImages)
          .values(imagesData.map(img => ({ ...img, productId: newProduct.id })))
          .returning();
      }

      return {
        ...newProduct,
        images: insertedImages
      };
    });
  },

  /**
   * Update an existing product and optionally sync its images.
   */
  updateProduct: async (
    id: string, 
    productData: Partial<NewProduct>, 
    imagesData?: Omit<NewProductImage, 'productId' | 'id'>[]
  ): Promise<ProductWithImages | null> => {
    return await db.transaction(async (tx) => {
      const [updatedProduct] = await tx.update(products)
        .set({ ...productData, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) return null;

      if (imagesData) {
        // Clear existing images and replace with new set
        await tx.delete(productImages).where(eq(productImages.productId, id));
        if (imagesData.length > 0) {
          await tx.insert(productImages)
            .values(imagesData.map(img => ({ ...img, productId: id })));
        }
      }

      const finalImages = await tx.select()
        .from(productImages)
        .where(eq(productImages.productId, id))
        .orderBy(asc(productImages.displayOrder));

      return {
        ...updatedProduct,
        images: finalImages
      };
    });
  },

  /**
   * Check if a product name is already taken.
   */
  checkNameUniqueness: async (name: string, excludeId?: string): Promise<boolean> => {
    const conditions = [eq(products.name, name)];
    if (excludeId) {
      conditions.push(ne(products.id, excludeId));
    }
    
    const [existing] = await db.select()
      .from(products)
      .where(and(...conditions))
      .limit(1);
    
    return !existing;
  },

  /**
   * Soft delete a product.
   */
  softDelete: async (id: string): Promise<void> => {
    await db.update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id));
  },

  /**
   * Restore a soft-deleted product.
   */
  restore: async (id: string): Promise<void> => {
    await db.update(products)
      .set({ deletedAt: null })
      .where(eq(products.id, id));
  }
};
