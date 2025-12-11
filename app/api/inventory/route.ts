import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, suppliers } from '@/lib/db/schema';
import { desc, like, or, eq, sql } from 'drizzle-orm';

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
        categoryName: categories.name,
        supplierId: products.supplierId,
        supplierName: suppliers.name,
        price: products.price,
        quantity: products.quantity,
        reorderLevel: products.reorderLevel,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .orderBy(desc(products.createdAt));

    const items = await query;
    
    // Apply filters in memory (simpler approach)
    let filteredItems = items;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }

    if (categoryId) {
      filteredItems = filteredItems.filter(item => item.categoryId === parseInt(categoryId));
    }

    if (lowStock === 'true') {
      filteredItems = filteredItems.filter(item => item.quantity <= (item.reorderLevel || 10));
    }

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await db.insert(products).values(body).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
