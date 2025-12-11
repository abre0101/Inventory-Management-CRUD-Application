import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function generateSKU(categoryId: number): Promise<string> {
  // Get the category to find its SKU prefix
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  if (!category || category.length === 0) {
    throw new Error('Category not found');
  }

  const prefix = category[0].skuPrefix;

  // Find the last product with this prefix
  const lastProduct = await db
    .select()
    .from(products)
    .where(like(products.sku, `${prefix}-%`))
    .orderBy(desc(products.sku))
    .limit(1);

  let nextNumber = 1;

  if (lastProduct && lastProduct.length > 0) {
    // Extract the number from the last SKU (e.g., "SPICE-005" -> 5)
    const lastSKU = lastProduct[0].sku;
    const match = lastSKU.match(/-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  // Format with leading zeros (e.g., 001, 002, etc.)
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  return `${prefix}-${formattedNumber}`;
}
