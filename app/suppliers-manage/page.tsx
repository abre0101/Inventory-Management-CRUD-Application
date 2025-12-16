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
      
      // Delete existing category relationships
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

    // Add new category relationships
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
    
    // Fetch existing category relationships
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <Link 
                href="/" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                ← Back to Inventory
              </Link>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>
                🏢 Manage Suppliers
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSupplier(null);
                setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', categoryIds: [] });
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9375rem',
              }}
            >
              ➕ Add Supplier
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
              {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                    Supplier Name *
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
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    minHeight: '60px',
                  }}
                  rows={2}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#334155' }}>
                  Categories Supplied *
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: formData.categoryIds.includes(category.id) ? '#eff6ff' : '#f8fafc',
                        border: `2px solid ${formData.categoryIds.includes(category.id) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
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
                  {editingSupplier ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSupplier(null);
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

        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: '0.875rem' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: '0.875rem' }}>Contact</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: '0.875rem' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: '0.875rem' }}>Phone</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '700', color: '#334155', fontSize: '0.875rem', width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#0f172a' }}>{supplier.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{supplier.contactPerson || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#3b82f6', fontSize: '0.875rem' }}>{supplier.email || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{supplier.phone || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(supplier)}
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
                        onClick={() => handleDelete(supplier.id)}
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
        </div>
      </div>
    </div>
  );
}
