'use client';

import { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>
                📦 Inventory Management
              </h1>
              <nav className={styles.navigation}>
                <Link href="/dashboard" className={styles.navLink}>
                  📊 Dashboard
                </Link>
                <Link href="/stock-movements" className={styles.navLink}>
                  📜 Stock History
                </Link>
                <Link href="/suppliers" className={styles.navLink}>
                  🏢 Suppliers
                </Link>
                <Link href="/categories" className={styles.navLink}>
                  �n Categories
                </Link>
                <Link href="/suppliers-manage" className={styles.navLink}>
                  ⚙️ Manage Suppliers
                </Link>
              </nav>
            </div>
            <div className={styles.actions}>
              <button
                onClick={handleExport}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                📥 Export
              </button>
              <label className={`${styles.button} ${styles.buttonPurple}`} style={{ opacity: importing ? 0.6 : 1, cursor: importing ? 'not-allowed' : 'pointer' }}>
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
                className={`${styles.button} ${styles.buttonGray}`}
              >
                📄 Template
              </a>
              <button
                onClick={() => setShowForm(true)}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                ➕ Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={styles.filterSection}>
          <div className={styles.filterGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search by name, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  📂 Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.select}
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
                  padding: '0.625rem 0.875rem',
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
                  <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: '600', whiteSpace: 'nowrap' }}>
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

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Qty</th>
                <th>Reorder</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>No products found</div>
                    <div style={{ fontSize: '0.9375rem' }}>Click "Add Product" to get started</div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLowStock = item.quantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} style={{ 
                      backgroundColor: isLowStock ? '#fef2f2' : 'white',
                    }}>
                      <td style={{ color: '#475569', fontFamily: 'monospace', fontWeight: '600' }}>{item.sku}</td>
                      <td style={{ color: '#0f172a', fontWeight: '600' }}>
                        <div>{item.name}</div>
                        {isLowStock && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '700', display: 'block', marginTop: '0.25rem' }}>⚠️ Low Stock</span>}
                      </td>
                      <td style={{ color: '#64748b' }}>
                        <span style={{ 
                          backgroundColor: '#f1f5f9', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {item.categoryName || '-'}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>{item.supplierName || '-'}</td>
                      <td style={{ 
                        color: isLowStock ? '#ef4444' : '#0f172a', 
                        fontWeight: '700'
                      }}>
                        {item.quantity}
                      </td>
                      <td>
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
                          fontSize: '0.875rem'
                        }}>
                          {isLowStock ? '⚠️' : '✓'} {item.reorderLevel}
                        </div>
                      </td>
                      <td style={{ color: '#0f172a', fontWeight: '600' }}>
                        <div>{parseFloat(item.price).toFixed(2)} Birr</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                          /{item.unit || 'piece'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => setAdjustingStock(item)}
                            className={styles.actionButton}
                            style={{
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              borderColor: '#a7f3d0'
                            }}
                          >
                            📊 Stock
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className={styles.actionButton}
                            style={{
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                              borderColor: '#bfdbfe'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={styles.actionButton}
                            style={{
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              borderColor: '#fecaca'
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
