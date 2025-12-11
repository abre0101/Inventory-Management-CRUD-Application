'use client';

import { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [adjustingStock, setAdjustingStock] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategories();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchItems();
  }, [searchTerm, selectedCategory, showLowStock]);

  const fetchItems = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('categoryId', selectedCategory);
    if (showLowStock) params.append('lowStock', 'true');

    const res = await fetch(`/api/inventory?${params.toString()}`);
    const data = await res.json();
    setItems(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleCreate = async (data: any) => {
    await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchItems();
  };

  const handleUpdate = async (data: any) => {
    await fetch(`/api/inventory/${editingItem?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditingItem(null);
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/inventory/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export inventory');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        alert(`Successfully imported ${result.imported} products. ${result.errors > 0 ? `${result.errors} errors occurred.` : ''}`);
        fetchItems();
      } else {
        alert('Import failed: ' + result.error);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import inventory');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Inventory Management</h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link href="/dashboard" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}>
                Dashboard
              </Link>
              <Link href="/stock-movements" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}>
                Stock History
              </Link>
              <Link href="/suppliers" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}>
                Suppliers
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              📥 Export CSV
            </button>
            <label style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              borderRadius: '0.5rem',
              cursor: importing ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: importing ? 0.5 : 1,
              display: 'inline-block',
            }}>
              {importing ? '⏳ Importing...' : '📤 Import CSV'}
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={importing}
                style={{ display: 'none' }}
              />
            </label>
            <a
              href="/inventory-template.csv"
              download
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6b7280',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-block',
              }}
            >
              📄 Template
            </a>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>Low Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {(showForm || editingItem) && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              {editingItem ? 'Edit Product' : 'New Product'}
            </h2>
            <ProductForm
              item={editingItem || undefined}
              onSubmit={editingItem ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', width: '120px' }}>SKU</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Supplier</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', width: '100px' }}>Quantity</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', width: '100px' }}>Price</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    No products found. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLowStock = item.quantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: isLowStock ? '#fef2f2' : 'transparent' }}>
                      <td style={{ padding: '1rem 1.5rem', color: '#111827', fontFamily: 'monospace' }}>{item.sku}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#111827', fontWeight: '500' }}>
                        {item.name}
                        {isLowStock && <span style={{ marginLeft: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>⚠️ Low</span>}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{item.categoryName || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{item.supplierName || '-'}</td>
                      <td style={{ padding: '1rem 1.5rem', color: isLowStock ? '#dc2626' : '#111827', fontWeight: isLowStock ? '600' : 'normal' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#111827' }}>${parseFloat(item.price).toFixed(2)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setAdjustingStock(item)}
                            style={{
                              color: '#059669',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              textDecoration: 'underline',
                              fontSize: '0.875rem',
                            }}
                          >
                            Stock
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            style={{
                              color: '#2563eb',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              textDecoration: 'underline',
                              fontSize: '0.875rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              color: '#dc2626',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              textDecoration: 'underline',
                              fontSize: '0.875rem',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {adjustingStock && (
          <StockAdjustmentModal
            product={adjustingStock}
            onClose={() => setAdjustingStock(null)}
            onSuccess={() => {
              fetchItems();
              setAdjustingStock(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
