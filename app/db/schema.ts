import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const unitOfSaleEnum = ['stem', 'bunch', 'bouquet'] as const;
export type UnitOfSale = typeof unitOfSaleEnum[number];

export const categoryEnum = ['roses', 'tulips', 'sunflowers', 'hydrangeas', 'mixed'] as const;
export type Category = typeof categoryEnum[number];

export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull().unique(),
  priceCents: integer('price_cents').notNull(),
  stockQuantity: integer('stock_quantity').notNull(),
  unitOfSale: text('unit_of_sale', { enum: unitOfSaleEnum }).notNull(),
  description: text('description').notNull(),
  category: text('category', { enum: categoryEnum }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text').notNull(),
  displayOrder: integer('display_order').notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
