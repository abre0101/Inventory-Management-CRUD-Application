import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUnits() {
  try {
    console.log('Updating product units...');

    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*');

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      console.log('No products found');
      return;
    }

    // Update units based on product names/categories
    for (const product of products) {
      let unit = 'piece'; // default

      const name = product.name.toLowerCase();
      
      // Determine unit based on product name
      if (name.includes('coffee') || name.includes('bean') || name.includes('flour') || name.includes('spice')) {
        unit = 'kg';
      } else if (name.includes('coca') || name.includes('drink') || name.includes('beverage')) {
        unit = 'bottle';
      } else if (name.includes('phone') || name.includes('samsung') || name.includes('electronic')) {
        unit = 'piece';
      } else if (name.includes('textile') || name.includes('shawl') || name.includes('kemis') || name.includes('fabric')) {
        unit = 'piece';
      } else if (name.includes('ceremony') || name.includes('set')) {
        unit = 'box';
      }

      console.log(`Updating ${product.name} to unit: ${unit}`);

      const { error: updateError } = await supabase
        .from('products')
        .update({ unit })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating ${product.name}:`, updateError);
      }
    }

    console.log('\n✅ Units updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating units:', error);
    process.exit(1);
  }
}

updateUnits();
