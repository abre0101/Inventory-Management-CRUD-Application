import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, suppliers, products } from '@/lib/db/schema';

export async function POST() {
  try {
    // Add categories
    const cats = await db.insert(categories).values([
      { name: 'Coffee & Tea', skuPrefix: 'COFFEE', description: 'Ethiopian coffee beans and tea products' },
      { name: 'Spices & Grains', skuPrefix: 'SPICE', description: 'Berbere, teff, and other Ethiopian spices' },
      { name: 'Textiles', skuPrefix: 'TEXT', description: 'Traditional Ethiopian clothing and fabrics' },
      { name: 'Handicrafts', skuPrefix: 'CRAFT', description: 'Ethiopian handmade crafts and art' },
      { name: 'Electronics', skuPrefix: 'ELEC', description: 'Electronic devices and accessories' },
    ]).returning();

    // Add suppliers
    const sups = await db.insert(suppliers).values([
      { 
        name: 'Addis Coffee Exporters', 
        contactPerson: 'Abebe Kebede',
        email: 'abebe@addiscoffee.et',
        phone: '+251-11-123-4567'
      },
      { 
        name: 'Habesha Spice Trading', 
        contactPerson: 'Tigist Alemayehu',
        email: 'tigist@habeshaspice.et',
        phone: '+251-11-234-5678'
      },
      { 
        name: 'Ethiopian Textile House', 
        contactPerson: 'Dawit Tesfaye',
        email: 'dawit@ethtextile.et',
        phone: '+251-11-345-6789'
      },
      { 
        name: 'Merkato Electronics', 
        contactPerson: 'Solomon Girma',
        email: 'solomon@merkatotech.et',
        phone: '+251-11-456-7890'
      },
    ]).returning();

    // Add sample products
    await db.insert(products).values([
      {
        sku: 'COFFEE-001',
        name: 'Yirgacheffe Coffee Beans',
        description: 'Premium grade Yirgacheffe coffee beans - 1kg',
        categoryId: cats[0].id,
        supplierId: sups[0].id,
        price: '850.00',
        quantity: 120,
        reorderLevel: 30,
      },
      {
        sku: 'COFFEE-002',
        name: 'Sidamo Coffee Beans',
        description: 'Organic Sidamo coffee beans - 1kg',
        categoryId: cats[0].id,
        supplierId: sups[0].id,
        price: '780.00',
        quantity: 95,
        reorderLevel: 25,
      },
      {
        sku: 'SPICE-001',
        name: 'Berbere Spice Mix',
        description: 'Traditional Ethiopian berbere spice blend - 500g',
        categoryId: cats[1].id,
        supplierId: sups[1].id,
        price: '320.00',
        quantity: 200,
        reorderLevel: 40,
      },
      {
        sku: 'GRAIN-001',
        name: 'Teff Flour',
        description: 'White teff flour for injera - 2kg',
        categoryId: cats[1].id,
        supplierId: sups[1].id,
        price: '450.00',
        quantity: 150,
        reorderLevel: 35,
      },
      {
        sku: 'TEXT-001',
        name: 'Habesha Kemis',
        description: 'Traditional Ethiopian dress with embroidery',
        categoryId: cats[2].id,
        supplierId: sups[2].id,
        price: '2500.00',
        quantity: 25,
        reorderLevel: 5,
      },
      {
        sku: 'TEXT-002',
        name: 'Netela Shawl',
        description: 'Traditional white cotton shawl',
        categoryId: cats[2].id,
        supplierId: sups[2].id,
        price: '650.00',
        quantity: 45,
        reorderLevel: 10,
      },
      {
        sku: 'CRAFT-001',
        name: 'Ethiopian Coffee Ceremony Set',
        description: 'Complete jebena coffee ceremony set',
        categoryId: cats[3].id,
        supplierId: sups[2].id,
        price: '1200.00',
        quantity: 18,
        reorderLevel: 5,
      },
      {
        sku: 'ELEC-001',
        name: 'Mobile Phone',
        description: 'Smartphone with dual SIM',
        categoryId: cats[4].id,
        supplierId: sups[3].id,
        price: '8500.00',
        quantity: 30,
        reorderLevel: 8,
      },
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      categories: cats.length,
      suppliers: sups.length,
      products: 8
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 });
  }
}
