'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const res = await fetch('/api/stock-movements');
      const data = await res.json();
      setMovements(data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'in': return '#059669';
      case 'out': return '#dc2626';
      case 'adjustment': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'in': return '↑ Stock In';
      case 'out': return '↓ Stock Out';
      case 'adjustment': return '⚙ Adjustment';
      default: return type;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            Stock Movement History
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading...</div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f3f4f6' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Product</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Quantity</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Reason</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#111827' }}>
                        <div style={{ fontWeight: '500' }}>{movement.productName}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                          {movement.productSku}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          color: getTypeColor(movement.type),
                          fontWeight: '500',
                          fontSize: '0.875rem',
                        }}>
                          {getTypeLabel(movement.type)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#111827', fontWeight: '600' }}>
                        {movement.quantity}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>
                        {movement.reason || '-'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {movement.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
