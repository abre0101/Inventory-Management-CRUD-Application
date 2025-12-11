import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Total products
    const totalProducts = await db.select({ count: sql<number>`count(*)` }).from(products);
    
    // Total inventory value
    const totalValue = await db.select({ 
      value: sql<number>`sum(CAST(${products.price} AS NUMERIC) * ${products.quantity})` 
    }).from(products);
    
    // Low stock items
    const lowStockItems = await db
      .select()
      .from(products)
      .where(sql`${products.quantity} <= ${products.reorderLevel}`);
    
    // Products by category
    const productsByCategory = await db
      .select({
        categoryName: categories.name,
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .groupBy(categories.name);

    return NextResponse.json({
      totalProducts: totalProducts[0]?.count || 0,
      totalValue: totalValue[0]?.value || 0,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems,
      productsByCategory,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
