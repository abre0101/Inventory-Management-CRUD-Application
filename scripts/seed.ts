import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  try {
    console.log('Seeding database...');

    // Add categories
    const { data: cats, error: catError } = await supabase
      .from('categories')
      .insert([
        { name: 'Coffee & Tea', sku_prefix: 'COFFEE', description: 'Ethiopian coffee beans and tea products' },
        { name: 'Spices & Grains', sku_prefix: 'SPICE', description: 'Berbere, teff, and other Ethiopian spices' },
        { name: 'Textiles', sku_prefix: 'TEXT', description: 'Traditional Ethiopian clothing and fabrics' },
        { name: 'Handicrafts', sku_prefix: 'CRAFT', description: 'Ethiopian handmade crafts and art' },
        { name: 'Electronics', sku_prefix: 'ELEC', description: 'Electronic devices and accessories' },
      ])
      .select();
    
    if (catError) throw catError;
    console.log('✓ Categories created');

    // Add suppliers
    const { data: sups, error: supError } = await supabase
      .from('suppliers')
      .insert([
        { 
          name: 'Addis Coffee Exporters', 
          contact_person: 'Abebe Kebede',
          email: 'abebe@addiscoffee.et',
          phone: '+251-11-123-4567'
        },
        { 
          name: 'Habesha Spice Trading', 
          contact_person: 'Tigist Alemayehu',
          email: 'tigist@habeshaspice.et',
          phone: '+251-11-234-5678'
        },
        { 
          name: 'Ethiopian Textile House', 
          contact_person: 'Dawit Tesfaye',
          email: 'dawit@ethtextile.et',
          phone: '+251-11-345-6789'
        },
        { 
          name: 'Merkato Electronics', 
          contact_person: 'Solomon Girma',
          email: 'solomon@merkatotech.et',
          phone: '+251-11-456-7890'
        },
      ])
      .select();
    
    if (supError) throw supError;
    console.log('✓ Suppliers created');

    // Add category-supplier relationships
    const { error: catSupError } = await supabase
      .from('category_suppliers')
      .insert([
        // Coffee & Tea suppliers
        { category_id: cats![0].id, supplier_id: sups![0].id },
        
        // Spices & Grains suppliers
        { category_id: cats![1].id, supplier_id: sups![1].id },
        
        // Textiles suppliers
        { category_id: cats![2].id, supplier_id: sups![2].id },
        
        // Handicrafts suppliers
        { category_id: cats![3].id, supplier_id: sups![2].id },
        
        // Electronics suppliers
        { category_id: cats![4].id, supplier_id: sups![3].id },
      ]);
    
    if (catSupError) throw catSupError;
    console.log('✓ Category-Supplier relationships created');

    // Add products
    const { error: prodError } = await supabase
      .from('products')
      .insert([
        {
          sku: 'COFFEE-001',
          name: 'Yirgacheffe Coffee Beans',
          description: 'Premium grade Yirgacheffe coffee beans - 1kg',
          category_id: cats![0].id,
          supplier_id: sups![0].id,
          price: 850.00,
          quantity: 120,
          reorder_level: 30,
        },
        {
          sku: 'COFFEE-002',
          name: 'Sidamo Coffee Beans',
          description: 'Organic Sidamo coffee beans - 1kg',
          category_id: cats![0].id,
          supplier_id: sups![0].id,
          price: 780.00,
          quantity: 95,
          reorder_level: 25,
        },
        {
          sku: 'SPICE-001',
          name: 'Berbere Spice Mix',
          description: 'Traditional Ethiopian berbere spice blend - 500g',
          category_id: cats![1].id,
          supplier_id: sups![1].id,
          price: 320.00,
          quantity: 200,
          reorder_level: 40,
        },
        {
          sku: 'GRAIN-001',
          name: 'Teff Flour',
          description: 'White teff flour for injera - 2kg',
          category_id: cats![1].id,
          supplier_id: sups![1].id,
          price: 450.00,
          quantity: 150,
          reorder_level: 35,
        },
        {
          sku: 'TEXT-001',
          name: 'Habesha Kemis',
          description: 'Traditional Ethiopian dress with embroidery',
          category_id: cats![2].id,
          supplier_id: sups![2].id,
          price: 2500.00,
          quantity: 25,
          reorder_level: 5,
        },
        {
          sku: 'TEXT-002',
          name: 'Netela Shawl',
          description: 'Traditional white cotton shawl',
          category_id: cats![2].id,
          supplier_id: sups![2].id,
          price: 650.00,
          quantity: 45,
          reorder_level: 10,
        },
        {
          sku: 'CRAFT-001',
          name: 'Ethiopian Coffee Ceremony Set',
          description: 'Complete jebena coffee ceremony set',
          category_id: cats![3].id,
          supplier_id: sups![2].id,
          price: 1200.00,
          quantity: 18,
          reorder_level: 5,
        },
        {
          sku: 'ELEC-001',
          name: 'Mobile Phone',
          description: 'Smartphone with dual SIM',
          category_id: cats![4].id,
          supplier_id: sups![3].id,
          price: 8500.00,
          quantity: 30,
          reorder_level: 8,
        },
      ]);
    
    if (prodError) throw prodError;
    console.log('✓ Sample products created');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
