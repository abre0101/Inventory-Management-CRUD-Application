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
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (showLowStock) params.append('lowStock', 'true');

      const res = await fetch(`/api/inventory?${params.toString()}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
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
      // Build query params with current filters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (showLowStock) params.append('lowStock', 'true');

      const res = await fetch(`/api/inventory/export?${params.toString()}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generate filename based on filters
      let filename = 'inventory-export';
      if (selectedCategory) {
        const categoryName = categories.find(c => c.id === parseInt(selectedCategory))?.name || 'filtered';
        filename += `-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
      }
      if (showLowStock) filename += '-low-stock';
      if (searchTerm) filename += '-search';
      filename += `-${new Date().toISOString().split('T')[0]}.csv`;
      
      a.download = filename;
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1.5rem)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: 'clamp(1rem, 3vw, 2rem)', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          marginBottom: 'clamp(1rem, 3vw, 2rem)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', 
                fontWeight: '700', 
                color: '#0f172a',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em'
              }}>
                📦 Inventory Management
              </h1>
              <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1.5rem)', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/dashboard" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.2s'
                }}>
                  📊 Dashboard
                </Link>
                <Link href="/stock-movements" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.2s'
                }}>
                  📜 Stock History
                </Link>
                <Link href="/suppliers" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.2s'
                }}>
                  🏢 Suppliers
                </Link>
                <Link href="/categories" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.2s'
                }}>
                  📂 Categories
                </Link>
                <Link href="/suppliers-manage" style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.2s'
                }}>
                  ⚙️ Manage Suppliers
                </Link>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
              <button
                onClick={handleExport}
                style={{
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  flex: '1 1 auto',
                  minWidth: 'fit-content'
                }}
              >
                📥 Export
              </button>
              <label style={{
                padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)',
                backgroundColor: '#8b5cf6',
                color: 'white',
                borderRadius: '0.5rem',
                cursor: importing ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                opacity: importing ? 0.6 : 1,
                display: 'inline-block',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                flex: '1 1 auto',
                minWidth: 'fit-content',
                textAlign: 'center'
              }}>
                {importing ? '⏳ Importing...' : '📤 Import'}
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
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)',
                  backgroundColor: '#64748b',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  display: 'inline-block',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                  textAlign: 'center'
                }}
              >
                📄 Template
              </a>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                  flex: '1 1 auto',
                  minWidth: 'fit-content'
                }}
              >
                ➕ Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: 'clamp(1rem, 3vw, 1.75rem)', 
          borderRadius: '1rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search by name, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.875rem)',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  📂 Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.875rem)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  cursor: 'pointer',
                  padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.875rem)',
                  backgroundColor: showLowStock ? '#fef2f2' : '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: showLowStock ? '#fecaca' : '#e2e8f0',
                  transition: 'all 0.2s',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  <input
                    type="checkbox"
                    checked={showLowStock}
                    onChange={(e) => setShowLowStock(e.target.checked)}
                    style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#334155', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    ⚠️ Low Stock
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {(showForm || editingItem) && (
          <div style={{
            backgroundColor: 'white',
            padding: 'clamp(1rem, 3vw, 2rem)',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', 
              fontWeight: '700', 
              marginBottom: 'clamp(1rem, 3vw, 1.75rem)', 
              color: '#0f172a',
              paddingBottom: 'clamp(0.75rem, 2vw, 1rem)',
              borderBottom: '2px solid #e2e8f0'
            }}>
              {editingItem ? '✏️ Edit Product' : '➕ New Product'}
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
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'auto',
          border: '1px solid #e2e8f0',
          WebkitOverflowScrolling: 'touch'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '80px' }}>SKU</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '150px' }}>Product Name</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '100px' }}>Category</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '100px' }}>Supplier</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '60px' }}>Qty</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '80px' }}>Reorder</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '90px' }}>Price</th>
                <th style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>📦</div>
                    <div style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '500', marginBottom: '0.5rem' }}>No products found</div>
                    <div style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>Click "Add Product" to get started</div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLowStock = item.quantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} style={{ 
                      borderTop: '1px solid #e2e8f0', 
                      backgroundColor: isLowStock ? '#fef2f2' : 'white',
                      transition: 'background-color 0.2s'
                    }}>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', color: '#475569', fontFamily: 'monospace', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '600' }}>{item.sku}</td>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', color: '#0f172a', fontWeight: '600', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                        <div>{item.name}</div>
                        {isLowStock && <span style={{ color: '#ef4444', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '700', display: 'block', marginTop: '0.25rem' }}>⚠️ Low Stock</span>}
                      </td>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', color: '#64748b', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                        <span style={{ 
                          backgroundColor: '#f1f5f9', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.375rem',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {item.categoryName || '-'}
                        </span>
                      </td>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', color: '#64748b', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>{item.supplierName || '-'}</td>
                      <td style={{ 
                        padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', 
                        color: isLowStock ? '#ef4444' : '#0f172a', 
                        fontWeight: '700',
                        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                      }}>
                        {item.quantity}
                      </td>
                      <td style={{ 
                        padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', 
                        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: isLowStock ? '#fef2f2' : '#f0fdf4',
                          color: isLowStock ? '#dc2626' : '#16a34a',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          border: `1px solid ${isLowStock ? '#fecaca' : '#bbf7d0'}`,
                          fontWeight: '600',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                        }}>
                          {isLowStock ? '⚠️' : '✓'} {item.reorderLevel}
                        </div>
                      </td>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)', color: '#0f172a', fontWeight: '600', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                        <div>{parseFloat(item.price).toFixed(2)} Birr</div>
                        <span style={{ fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', color: '#64748b', fontWeight: '500' }}>
                          /{item.unit || 'piece'}
                        </span>
                      </td>
                      <td style={{ padding: 'clamp(0.75rem, 2vw, 1.125rem) clamp(0.75rem, 2vw, 1.5rem)' }}>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setAdjustingStock(item)}
                            style={{
                              padding: 'clamp(0.25rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              cursor: 'pointer',
                              border: '1px solid #a7f3d0',
                              borderRadius: '0.375rem',
                              fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            📊 Stock
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            style={{
                              padding: 'clamp(0.25rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              cursor: 'pointer',
                              border: '1px solid #bfdbfe',
                              borderRadius: '0.375rem',
                              fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              padding: 'clamp(0.25rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              cursor: 'pointer',
                              border: '1px solid #fecaca',
                              borderRadius: '0.375rem',
                              fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            🗑️ Delete
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
