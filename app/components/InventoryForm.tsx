'use client';

import { useState } from 'react';
import type { Inventory } from '@/lib/db/schema';

interface InventoryFormProps {
  item?: Inventory;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function InventoryForm({ item, onSubmit, onCancel }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    quantity: item?.quantity || 0,
    price: item?.price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      <div>
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
          required
        />
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
          <label style={labelStyle}>Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            style={inputStyle}
            required
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          {item ? 'Update' : 'Create'}
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
