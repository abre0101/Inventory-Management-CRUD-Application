import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = parseInt(params.id);
    const items = await db
      .select()
      .from(products)
      .where(eq(products.supplierId, supplierId));
    
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier products' }, { status: 500 });
  }
}
