'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../shared.module.css';

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Inventory
          </Link>
          <h1 className={styles.title}>
            📜 Stock Movement History
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading...</div>
        ) : (
          <div className={styles.tableContainer}>
            {/* Desktop Table */}
            <table className={`${styles.table} ${styles.desktopTable}`}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Notes</th>
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
                    <tr key={movement.id}>
                      <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td style={{ color: '#111827' }}>
                        <div style={{ fontWeight: '500' }}>{movement.productName}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                          {movement.productSku}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          color: getTypeColor(movement.type),
                          fontWeight: '500',
                          fontSize: '0.875rem',
                        }}>
                          {getTypeLabel(movement.type)}
                        </span>
                      </td>
                      <td style={{ color: '#111827', fontWeight: '600' }}>
                        {movement.quantity}
                      </td>
                      <td style={{ color: '#6b7280' }}>
                        {movement.reason || '-'}
                      </td>
                      <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {movement.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className={styles.mobileCard}>
              {movements.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#6b7280' }}>
                  No stock movements recorded yet.
                </div>
              ) : (
                movements.map((movement) => (
                  <div key={movement.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardTitle}>{movement.productName}</div>
                      <span 
                        className={styles.cardBadge}
                        style={{
                          backgroundColor: getTypeColor(movement.type) + '20',
                          color: getTypeColor(movement.type),
                        }}
                      >
                        {getTypeLabel(movement.type)}
                      </span>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <div className={styles.cardDetail}>
                        <span className={styles.cardLabel}>SKU</span>
                        <span className={styles.cardValue} style={{ fontFamily: 'monospace' }}>
                          {movement.productSku}
                        </span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.cardLabel}>Quantity</span>
                        <span className={styles.cardValue}>{movement.quantity}</span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.cardLabel}>Date</span>
                        <span className={styles.cardValue} style={{ fontSize: '0.75rem' }}>
                          {new Date(movement.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.cardLabel}>Reason</span>
                        <span className={styles.cardValue}>{movement.reason || '-'}</span>
                      </div>
                      {movement.notes && (
                        <div className={styles.cardDetail} style={{ gridColumn: '1 / -1' }}>
                          <span className={styles.cardLabel}>Notes</span>
                          <span className={styles.cardValue}>{movement.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
