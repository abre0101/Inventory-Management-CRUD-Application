import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suppliers, categorySuppliers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId: categoryIdStr } = await params;
    const categoryId = parseInt(categoryIdStr);
    
    // Get suppliers associated with this category
    const result = await db
      .select({
        id: suppliers.id,
        name: suppliers.name,
        contactPerson: suppliers.contactPerson,
        email: suppliers.email,
        phone: suppliers.phone,
        address: suppliers.address,
      })
      .from(suppliers)
      .innerJoin(categorySuppliers, eq(suppliers.id, categorySuppliers.supplierId))
      .where(eq(categorySuppliers.categoryId, categoryId));
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers for category' }, { status: 500 });
  }
}
