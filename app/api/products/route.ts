import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, suppliers } from '@/lib/db/schema';
import { desc, like, or, eq, lt } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const lowStock = searchParams.get('lowStock');

    let query = db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        supplierId: products.supplierId,
        price: products.price,
        quantity: products.quantity,
        reorderLevel: products.reorderLevel,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: categories.name,
        supplier: suppliers.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .orderBy(desc(products.createdAt));

    const items = await query;

    // Apply filters in memory (for simplicity)
    let filtered = items;

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      filtered = filtered.filter(item => item.categoryId === parseInt(categoryId));
    }

    if (lowStock === 'true') {
      filtered = filtered.filter(item => item.quantity <= (item.reorderLevel || 10));
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await db.insert(products).values(body).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
