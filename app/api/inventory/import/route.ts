import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories, suppliers } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 });
    }

    // Skip header row
    const dataLines = lines.slice(1);
    const imported = [];
    const errors = [];

    // Fetch all categories and suppliers for lookup
    const allCategories = await db.select().from(categories);
    const allSuppliers = await db.select().from(suppliers);

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        // Parse CSV line (handle quoted fields)
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
        
        if (values.length < 6) continue;

        const [sku, name, description, categoryName, supplierName, price, quantity, reorderLevel] = values;

        // Find category ID
        let categoryId = null;
        if (categoryName) {
          const category = allCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
          categoryId = category?.id || null;
        }

        // Find supplier ID
        let supplierId = null;
        if (supplierName) {
          const supplier = allSuppliers.find(s => s.name.toLowerCase() === supplierName.toLowerCase());
          supplierId = supplier?.id || null;
        }

        const productData = {
          sku: sku || `SKU-${Date.now()}-${i}`,
          name: name || 'Unnamed Product',
          description: description || null,
          categoryId,
          supplierId,
          price: price ? parseFloat(price).toFixed(2) : '0.00',
          quantity: quantity ? parseInt(quantity) : 0,
          reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
        };

        const result = await db.insert(products).values(productData).returning();
        imported.push(result[0]);
      } catch (error) {
        errors.push({ line: i + 2, error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import inventory' }, { status: 500 });
  }
}
