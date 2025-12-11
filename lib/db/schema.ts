import { pgTable, serial, text, integer, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  skuPrefix: text('sku_prefix').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Category-Supplier junction table (many-to-many relationship)
export const categorySuppliers = pgTable('category_suppliers', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products table (renamed from inventory)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  unit: text('unit').default('piece'), // piece, kg, liter, box, etc.
  quantity: integer('quantity').notNull().default(0),
  reorderLevel: integer('reorder_level').default(10),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stock movements table
export const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  type: text('type').notNull(), // 'in' or 'out' or 'adjustment'
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  categorySuppliers: many(categorySuppliers),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  categorySuppliers: many(categorySuppliers),
}));

export const categorySuppliersRelations = relations(categorySuppliers, ({ one }) => ({
  category: one(categories, {
    fields: [categorySuppliers.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [categorySuppliers.supplierId],
    references: [suppliers.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  stockMovements: many(stockMovements),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
}));

// Types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;

export type CategorySupplier = typeof categorySuppliers.$inferSelect;
export type NewCategorySupplier = typeof categorySuppliers.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;

// Legacy export for backward compatibility
export const inventory = products;
export type Inventory = Product;
export type NewInventory = NewProduct;
