import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, suppliers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const lowStock = searchParams.get('lowStock');

    // Fetch all items with joins
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

    // Apply filters
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

    // Convert to CSV
    const headers = ['SKU', 'Name', 'Description', 'Category', 'Supplier', 'Price (Birr)', 'Quantity', 'Reorder Level'];
    const csvRows = [headers.join(',')];

    for (const item of filteredItems) {
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
