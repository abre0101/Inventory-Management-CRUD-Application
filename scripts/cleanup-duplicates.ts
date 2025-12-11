import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  try {
    console.log('Cleaning up duplicate suppliers...');

    // Get all suppliers
    const { data: allSuppliers, error: fetchError } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;

    // Find duplicates by name
    const seen = new Map();
    const duplicates: number[] = [];

    for (const supplier of allSuppliers || []) {
      if (seen.has(supplier.name)) {
        duplicates.push(supplier.id);
      } else {
        seen.set(supplier.name, supplier.id);
      }
    }

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate suppliers`);
      
      // Update products and category_suppliers to point to the original supplier
      for (const dupId of duplicates) {
        const dupSupplier = allSuppliers?.find(s => s.id === dupId);
        const originalId = seen.get(dupSupplier?.name);
        
        console.log(`Updating references from supplier ${dupId} to ${originalId}`);
        
        // Update products
        const { error: updateError } = await supabase
          .from('products')
          .update({ supplier_id: originalId })
          .eq('supplier_id', dupId);
        
        if (updateError) console.error('Update products error:', updateError);
        
        // Delete duplicate category_suppliers entries
        const { error: deleteCSError } = await supabase
          .from('category_suppliers')
          .delete()
          .eq('supplier_id', dupId);
        
        if (deleteCSError) console.error('Delete category_suppliers error:', deleteCSError);
      }
      
      // Delete duplicates
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .in('id', duplicates);

      if (deleteError) throw deleteError;
      console.log(`✓ Deleted ${duplicates.length} duplicate suppliers`);
    } else {
      console.log('No duplicates found');
    }

    // Clean up duplicate categories
    console.log('\nCleaning up duplicate categories...');
    const { data: allCategories, error: catFetchError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (catFetchError) throw catFetchError;

    const catSeen = new Map();
    const catDuplicates: number[] = [];

    for (const category of allCategories || []) {
      if (catSeen.has(category.name)) {
        catDuplicates.push(category.id);
      } else {
        catSeen.set(category.name, category.id);
      }
    }

    if (catDuplicates.length > 0) {
      console.log(`Found ${catDuplicates.length} duplicate categories`);
      
      const { error: catDeleteError } = await supabase
        .from('categories')
        .delete()
        .in('id', catDuplicates);

      if (catDeleteError) throw catDeleteError;
      console.log(`✓ Deleted ${catDuplicates.length} duplicate categories`);
    } else {
      console.log('No duplicate categories found');
    }

    console.log('\n✅ Cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDuplicates();
