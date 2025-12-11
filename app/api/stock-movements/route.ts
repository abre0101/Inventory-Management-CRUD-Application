import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockMovements, products } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    let query = db
      .select({
        id: stockMovements.id,
        productId: stockMovements.productId,
        type: stockMovements.type,
        quantity: stockMovements.quantity,
        reason: stockMovements.reason,
        notes: stockMovements.notes,
        createdAt: stockMovements.createdAt,
        productName: products.name,
        productSku: products.sku,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt));

    const items = await query;

    if (productId) {
      return NextResponse.json(items.filter(item => item.productId === parseInt(productId)));
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock movements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, type, quantity } = body;

    // Create stock movement record
    const movement = await db.insert(stockMovements).values(body).returning();

    // Update product quantity
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (product.length > 0) {
      const currentQty = product[0].quantity;
      let newQty = currentQty;

      if (type === 'in') {
        newQty = currentQty + quantity;
      } else if (type === 'out') {
        newQty = Math.max(0, currentQty - quantity);
      } else if (type === 'adjustment') {
        newQty = quantity;
      }

      await db.update(products)
        .set({ quantity: newQty, updatedAt: new Date() })
        .where(eq(products.id, productId));
    }

    return NextResponse.json(movement[0]);
  } catch (error) {
    console.error('Error creating stock movement:', error);
    return NextResponse.json({ error: 'Failed to create stock movement' }, { status: 500 });
  }
}
