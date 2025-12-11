import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreRelationships() {
  try {
    console.log('Restoring category-supplier relationships...');

    // Get categories and suppliers
    const { data: categories } = await supabase.from('categories').select('*');
    const { data: suppliers } = await supabase.from('suppliers').select('*');

    if (!categories || !suppliers) {
      throw new Error('Failed to fetch categories or suppliers');
    }

    // Find category and supplier IDs by name
    const coffeeCategory = categories.find(c => c.name === 'Coffee & Tea');
    const spiceCategory = categories.find(c => c.name === 'Spices & Grains');
    const textileCategory = categories.find(c => c.name === 'Textiles');
    const craftCategory = categories.find(c => c.name === 'Handicrafts');
    const elecCategory = categories.find(c => c.name === 'Electronics');

    const coffeeSupplier = suppliers.find(s => s.name === 'Addis Coffee Exporters');
    const spiceSupplier = suppliers.find(s => s.name === 'Habesha Spice Trading');
    const textileSupplier = suppliers.find(s => s.name === 'Ethiopian Textile House');
    const elecSupplier = suppliers.find(s => s.name === 'Merkato Electronics');

    const relationships = [];

    if (coffeeCategory && coffeeSupplier) {
      relationships.push({ category_id: coffeeCategory.id, supplier_id: coffeeSupplier.id });
    }
    if (spiceCategory && spiceSupplier) {
      relationships.push({ category_id: spiceCategory.id, supplier_id: spiceSupplier.id });
    }
    if (textileCategory && textileSupplier) {
      relationships.push({ category_id: textileCategory.id, supplier_id: textileSupplier.id });
    }
    if (craftCategory && textileSupplier) {
      relationships.push({ category_id: craftCategory.id, supplier_id: textileSupplier.id });
    }
    if (elecCategory && elecSupplier) {
      relationships.push({ category_id: elecCategory.id, supplier_id: elecSupplier.id });
    }

    if (relationships.length > 0) {
      const { error } = await supabase
        .from('category_suppliers')
        .insert(relationships);

      if (error) throw error;
      console.log(`✓ Created ${relationships.length} category-supplier relationships`);
    } else {
      console.log('No relationships to create');
    }

    console.log('\n✅ Relationships restored successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error restoring relationships:', error);
    process.exit(1);
  }
}

restoreRelationships();
