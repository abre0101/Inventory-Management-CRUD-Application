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
  const [allSuppliers, setAllSuppliers] = useState<any[]>([]);
  const [nextSKU, setNextSKU] = useState<string>('');
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
    fetchAllSuppliers();
  }, []);

  // Fetch suppliers and generate SKU when category changes
  useEffect(() => {
    if (formData.categoryId) {
      fetchSuppliersByCategory(formData.categoryId);
      if (!item) { // Only generate SKU for new products
        fetchNextSKU(formData.categoryId);
      }
    } else {
      setSuppliers([]);
      setNextSKU('');
    }
  }, [formData.categoryId, item]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchAllSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      const data = await res.json();
      setAllSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setAllSuppliers([]);
    }
  };

  const fetchSuppliersByCategory = async (categoryId: number) => {
    try {
      const res = await fetch(`/api/suppliers/by-category/${categoryId}`);
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
      
      // Reset supplier selection if current supplier is not in the filtered list
      if (formData.supplierId && !data.find((s: any) => s.id === formData.supplierId)) {
        setFormData(prev => ({ ...prev, supplierId: null }));
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    }
  };

  const fetchNextSKU = async (categoryId: number) => {
    try {
      const res = await fetch(`/api/products/next-sku/${categoryId}`);
      const data = await res.json();
      setNextSKU(data.sku || '');
    } catch (error) {
      console.error('Error fetching next SKU:', error);
      setNextSKU('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId as any) : null,
      supplierId: formData.supplierId ? parseInt(formData.supplierId as any) : null,
    };
    
    // Remove SKU for new products (it will be auto-generated)
    if (!item) {
      delete submitData.sku;
    }
    
    onSubmit(submitData);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#334155',
    letterSpacing: '0.01em'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>SKU {item ? '' : '(Auto-generated)'}</label>
          <input
            type="text"
            value={item ? formData.sku : (nextSKU || 'Select category first')}
            style={{
              ...inputStyle,
              backgroundColor: '#f8fafc',
              color: '#64748b',
              cursor: 'not-allowed',
            }}
            readOnly
            disabled
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
            disabled={!formData.categoryId}
          >
            <option value="">
              {formData.categoryId ? 'Select Supplier' : 'Select Category First'}
            </option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>{sup.name}</option>
            ))}
          </select>
          {formData.categoryId && suppliers.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              No suppliers available for this category
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Quantity *</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Price (Birr) *</label>
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
            onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 10 })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
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
            fontSize: '0.9375rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          {item ? '✓ Update Product' : '✓ Create Product'}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9375rem',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e2e8f0';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
