'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../shared.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    skuPrefix: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', skuPrefix: '', description: '' });
    fetchCategories();
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      skuPrefix: category.skuPrefix,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure? This will affect all products in this category.')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: 'clamp(1rem, 3vw, 2rem)', 
          borderRadius: '1rem', 
          marginBottom: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <Link href="/" className={styles.backLink}>
                ← Back to Inventory
              </Link>
              <h1 className={styles.title}>
                📂 Categories
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setFormData({ name: '', skuPrefix: '', description: '' });
              }}
              style={{
                padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                width: '100%',
              }}
            >
              ➕ Add Category
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                    SKU Prefix * (e.g., ELEC, FOOD)
                  </label>
                  <input
                    type="text"
                    value={formData.skuPrefix}
                    onChange={(e) => setFormData({ ...formData, skuPrefix: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                      textTransform: 'uppercase',
                    }}
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    minHeight: '80px',
                  }}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '0.5rem',
                    border: '2px solid #e2e8f0',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableContainer}>
          {/* Desktop Table */}
          <table className={`${styles.table} ${styles.desktopTable}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU Prefix</th>
                <th>Description</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{category.name}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      color: '#3b82f6',
                    }}>
                      {category.skuPrefix}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{category.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(category)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className={styles.mobileCard}>
            {categories.map((category) => (
              <div key={category.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{category.name}</div>
                  <span 
                    className={styles.cardBadge}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#3b82f6',
                      fontFamily: 'monospace',
                    }}
                  >
                    {category.skuPrefix}
                  </span>
                </div>
                
                {category.description && (
                  <div style={{ marginBottom: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                    {category.description}
                  </div>
                )}

                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleEdit(category)}
                    className={styles.cardButton}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderColor: '#bfdbfe',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className={styles.cardButton}
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
