'use client';

import { useState } from 'react';

interface StockAdjustmentModalProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockAdjustmentModal({ product, onClose, onSuccess }: StockAdjustmentModalProps) {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        productId: product.id,
        type,
        quantity: type === 'adjustment' ? parseInt(quantity) : parseInt(quantity),
        reason,
        notes,
      };

      const res = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'clamp(0.5rem, 2vw, 1rem)',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: 'clamp(1rem, 3vw, 2rem)',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: '600', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', color: '#111827', wordBreak: 'break-word' }}>
          Adjust Stock: {product.name}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 'clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Current Stock: <strong>{product.quantity}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Adjustment Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              required
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.75rem)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            >
              <option value="in">Stock In (Add)</option>
              <option value="out">Stock Out (Remove)</option>
              <option value="adjustment">Set Exact Quantity</option>
            </select>
          </div>

          <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              {type === 'adjustment' ? 'New Quantity *' : 'Quantity *'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.75rem)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Purchase order, Sale"
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.75rem)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <label style={{ display: 'block', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Additional details..."
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.625rem, 2vw, 0.75rem)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.875rem, 2vw, 1rem)',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '500',
                flex: '1 1 auto',
                minWidth: 'fit-content'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.875rem, 2vw, 1rem)',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '500',
                flex: '1 1 auto',
                minWidth: 'fit-content'
              }}
            >
              {loading ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
