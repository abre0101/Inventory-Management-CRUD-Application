'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <Link href="/" className={styles.backButton}>
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
              className={styles.addButton}
            >
              ➕ Add Category
            </button>
          </div>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    SKU Prefix * (e.g., ELEC, FOOD)
                  </label>
                  <input
                    type="text"
                    value={formData.skuPrefix}
                    onChange={(e) => setFormData({ ...formData, skuPrefix: e.target.value.toUpperCase() })}
                    className={styles.input}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                <label className={styles.label}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableContainer}>
          {/* Desktop Table */}
          <table className={styles.table}>
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
                    <span className={styles.cardPrefix}>
                      {category.skuPrefix}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{category.description || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEdit(category)} className={styles.editButton}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
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
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{category.name}</div>
                  <div className={styles.cardPrefix}>{category.skuPrefix}</div>
                </div>
                <div className={styles.cardDescription}>
                  {category.description || 'No description'}
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(category)} className={styles.editButton}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
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
