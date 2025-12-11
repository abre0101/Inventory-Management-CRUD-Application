'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    setStats(data);
  };

  if (!stats) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Dashboard
          </h1>
          <Link href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            ← Back to Inventory
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Products</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{stats.totalProducts}</div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Inventory Value</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              ${parseFloat(stats.totalValue || 0).toFixed(2)}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Low Stock Items</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{stats.lowStockCount}</div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockCount > 0 && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b', marginBottom: '1rem' }}>
              ⚠️ Low Stock Alert
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.lowStockItems.slice(0, 5).map((item: any) => (
                <div key={item.id} style={{ color: '#7f1d1d' }}>
                  <strong>{item.name}</strong> - Only {item.quantity} left (Reorder at {item.reorderLevel})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products by Category */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Products by Category
          </h3>
          
          {/* Bar Chart */}
          <div style={{ marginBottom: '1.5rem' }}>
            {stats.productsByCategory.map((cat: any, idx: number) => {
              const maxCount = Math.max(...stats.productsByCategory.map((c: any) => c.count));
              const percentage = (cat.count / maxCount) * 100;
              const colors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#f59e0b', '#06b6d4'];
              const color = colors[idx % colors.length];
              
              return (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {cat.categoryName || 'Uncategorized'}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {cat.count}
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      backgroundColor: color,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* List View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            {stats.productsByCategory.map((cat: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151' }}>{cat.categoryName || 'Uncategorized'}</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{cat.count} products</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
