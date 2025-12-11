import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, suppliers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const items = await db
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
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id));

    // Convert to CSV
    const headers = ['SKU', 'Name', 'Description', 'Category', 'Supplier', 'Price', 'Quantity', 'Reorder Level'];
    const csvRows = [headers.join(',')];

    for (const item of items) {
      const row = [
        item.sku,
        `"${item.name}"`,
        `"${item.description || ''}"`,
        `"${item.categoryName || ''}"`,
        `"${item.supplierName || ''}"`,
        item.price,
        item.quantity,
        item.reorderLevel,
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inventory-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export inventory' }, { status: 500 });
  }
}
