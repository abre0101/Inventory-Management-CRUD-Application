import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categorySuppliers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const items = await db.select().from(categorySuppliers);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category-supplier relationships' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, supplierId } = body;
    
    // Check if relationship already exists
    const existing = await db
      .select()
      .from(categorySuppliers)
      .where(
        and(
          eq(categorySuppliers.categoryId, categoryId),
          eq(categorySuppliers.supplierId, supplierId)
        )
      );
    
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Relationship already exists' }, { status: 200 });
    }
    
    const newItem = await db.insert(categorySuppliers).values(body).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category-supplier relationship' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const supplierId = searchParams.get('supplierId');
    
    if (!categoryId || !supplierId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    
    await db
      .delete(categorySuppliers)
      .where(
        and(
          eq(categorySuppliers.categoryId, parseInt(categoryId)),
          eq(categorySuppliers.supplierId, parseInt(supplierId))
        )
      );
    
    return NextResponse.json({ message: 'Relationship deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete relationship' }, { status: 500 });
  }
}
