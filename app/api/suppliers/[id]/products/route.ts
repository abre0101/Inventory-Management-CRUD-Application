import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = parseInt(id);
    
    const items = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        price: products.price,
        quantity: products.quantity,
        reorderLevel: products.reorderLevel,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.supplierId, supplierId))
      .orderBy(desc(products.createdAt));
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    return NextResponse.json({ error: 'Failed to fetch supplier products' }, { status: 500 });
  }
}
