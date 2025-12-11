'use client';

import { useState, useEffect } from 'react';

interface ProductFormProps {
  item?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ item, onSubmit, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    sku: item?.sku || '',
    name: item?.name || '',
    description: item?.description || '',
    categoryId: item?.categoryId || null,
    supplierId: item?.supplierId || null,
    quantity: item?.quantity || 0,
    price: item?.price || '0',
    reorderLevel: item?.reorderLevel || 10,
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId as any) : null,
      supplierId: formData.supplierId ? parseInt(formData.supplierId as any) : null,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#374151'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>SKU *</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ ...inputStyle, minHeight: '80px' }}
          rows={3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : null })}
            style={inputStyle}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Supplier</label>
          <select
            value={formData.supplierId || ''}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value ? parseInt(e.target.value) : null })}
            style={inputStyle}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>{sup.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Quantity *</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Reorder Level</label>
          <input
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button 
          type="submit" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          {item ? 'Update Product' : 'Create Product'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
