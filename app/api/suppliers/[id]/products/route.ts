import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supplierId = parseInt(id);
    
    console.log('Fetching products for supplier:', supplierId);
    
    const items = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        price: products.price,
        unit: products.unit,
        quantity: products.quantity,
        reorderLevel: products.reorderLevel,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.supplierId, supplierId))
      .orderBy(desc(products.createdAt));
    
    console.log('Found products:', items.length);
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    return NextResponse.json({ error: 'Failed to fetch supplier products' }, { status: 500 });
  }
}
