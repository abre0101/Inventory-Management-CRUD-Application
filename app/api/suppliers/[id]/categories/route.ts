import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categorySuppliers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supplierId = parseInt(id);
    
    const categories = await db
      .select({
        categoryId: categorySuppliers.categoryId,
      })
      .from(categorySuppliers)
      .where(eq(categorySuppliers.supplierId, supplierId));
    
    return NextResponse.json(categories.map(c => c.categoryId));
  } catch (error) {
    console.error('Error fetching supplier categories:', error);
    return NextResponse.json({ error: 'Failed to fetch supplier categories' }, { status: 500 });
  }
}
