'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function SuppliersManagePage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categoryIds: [] as number[],
  });

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    const data = await res.json();
    setSuppliers(Array.isArray(data) ? data : []);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const supplierData = {
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    let supplierId;
    
    if (editingSupplier) {
      const res = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData),
      });
      const data = await res.json();
      supplierId = data.id;
      
      await fetch(`/api/category-suppliers?supplierId=${supplierId}`, {
        method: 'DELETE',
      });
    } else {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierData),
      });
      const data = await res.json();
      supplierId = data.id;
    }

    if (supplierId && formData.categoryIds.length > 0) {
      for (const categoryId of formData.categoryIds) {
        await fetch('/api/category-suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId, supplierId }),
        });
      }
    }
    
    setShowForm(false);
    setEditingSupplier(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', categoryIds: [] });
    fetchSuppliers();
  };

  const handleEdit = async (supplier: any) => {
    setEditingSupplier(supplier);
    
    try {
      const res = await fetch(`/api/suppliers/${supplier.id}/categories`);
      const existingCategoryIds = await res.json();
      
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        categoryIds: Array.isArray(existingCategoryIds) ? existingCategoryIds : [],
      });
    } catch (error) {
      console.error('Error loading supplier categories:', error);
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        categoryIds: [],
      });
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure? This will affect all products from this supplier.')) {
      await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      fetchSuppliers();
    }
  };

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
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
              <h1 className={styles.title}>🏢 Manage Suppliers</h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSupplier(null);
                setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', categoryIds: [] });
              }}
              className={styles.addButton}
            >
              ➕ Add Supplier
            </button>
          </div>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Supplier Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label className={styles.label}>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
              <div className={styles.categoriesSection}>
                <label className={styles.label}>Categories Supplied *</label>
                <div className={styles.categoriesGrid}>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={styles.categoryCheckbox}
                      style={{
                        backgroundColor: formData.categoryIds.includes(category.id) ? '#eff6ff' : '#f8fafc',
                        borderColor: formData.categoryIds.includes(category.id) ? '#3b82f6' : '#e2e8f0',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingSupplier ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSupplier(null);
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
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td style={{ fontWeight: '600', color: '#0f172a' }}>{supplier.name}</td>
                  <td style={{ color: '#64748b' }}>{supplier.contactPerson || '-'}</td>
                  <td style={{ color: '#3b82f6', fontSize: '0.875rem' }}>{supplier.email || '-'}</td>
                  <td style={{ color: '#64748b' }}>{supplier.phone || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleEdit(supplier)} className={styles.editButton}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className={styles.deleteButton}>
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
            {suppliers.map((supplier) => (
              <div key={supplier.id} className={styles.supplierCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{supplier.name}</div>
                </div>
                <div className={styles.cardDetails}>
                  {supplier.contactPerson && <div>👤 {supplier.contactPerson}</div>}
                  {supplier.email && <div>📧 {supplier.email}</div>}
                  {supplier.phone && <div>📞 {supplier.phone}</div>}
                  {supplier.address && <div>📍 {supplier.address}</div>}
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => handleEdit(supplier)} className={styles.editButton}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(supplier.id)} className={styles.deleteButton}>
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
