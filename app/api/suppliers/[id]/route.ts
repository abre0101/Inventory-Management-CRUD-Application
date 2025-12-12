import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suppliers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await db
      .update(suppliers)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(suppliers.id, parseInt(id)))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await db.delete(suppliers).where(eq(suppliers.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
