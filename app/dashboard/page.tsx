'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    setStats(data);
  };

  const exportToCSV = () => {
    if (!stats) return;

    const csvData = [
      ['Dashboard Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Products', stats.totalProducts],
      ['Total Inventory Value', `${parseFloat(stats.totalValue || 0).toFixed(2)} Birr`],
      ['Low Stock Items', stats.lowStockCount],
      [''],
      ['Products by Category'],
      ['Category', 'Count'],
      ...stats.productsByCategory.map((cat: any) => [cat.categoryName || 'Uncategorized', cat.count]),
      [''],
      ['Low Stock Items Detail'],
      ['SKU', 'Name', 'Current Stock', 'Reorder Level'],
      ...stats.lowStockItems.map((item: any) => [item.sku, item.name, item.quantity, item.reorderLevel])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    if (!stats) return;

    const jsonData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalProducts: stats.totalProducts,
        totalValue: parseFloat(stats.totalValue || 0),
        lowStockCount: stats.lowStockCount
      },
      productsByCategory: stats.productsByCategory,
      lowStockItems: stats.lowStockItems
    };

    const json = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const printReport = () => {
    window.print();
    setShowExportMenu(false);
  };

  if (!stats) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <div style={{ color: '#94a3b8', fontSize: '1.125rem' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; }
          button, a { display: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>📊 Analytics Dashboard</h1>
              <p className={styles.subtitle}>Real-time inventory insights and metrics</p>
            </div>
            <div className={styles.actions}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={styles.button}
                >
                  📥 Export
                </button>
                {showExportMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                    border: '1px solid #e2e8f0',
                    minWidth: '200px',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}>
                    <button
                      onClick={exportToCSV}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.25rem',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        color: '#334155',
                      }}
                    >
                      📄 Export as CSV
                    </button>
                    <button
                      onClick={exportToJSON}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.25rem',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        color: '#334155',
                      }}
                    >
                      📋 Export as JSON
                    </button>
                    <button
                      onClick={printReport}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.25rem',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        color: '#334155',
                      }}
                    >
                      🖨️ Print Report
                    </button>
                  </div>
                )}
              </div>
              <Link href="/" className={styles.button}>
                ← Back to Inventory
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            {/* Total Products */}
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
              }}>📦</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Products</div>
                <div className={styles.statValue} style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{stats.totalProducts}</div>
                <div className={styles.statDescription}>Items in inventory</div>
              </div>
            </div>

            {/* Total Value */}
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
              }}>💰</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Value</div>
                <div className={styles.statValue} style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.75rem'
                }}>
                  {parseFloat(stats.totalValue || 0).toLocaleString()} <span style={{ fontSize: '1rem' }}>Birr</span>
                </div>
                <div className={styles.statDescription}>Inventory worth</div>
              </div>
            </div>

            {/* Low Stock */}
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{
                background: stats.lowStockCount > 0 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                boxShadow: stats.lowStockCount > 0 
                  ? '0 8px 16px rgba(245, 158, 11, 0.3)'
                  : '0 8px 16px rgba(6, 182, 212, 0.3)'
              }}>{stats.lowStockCount > 0 ? '⚠️' : '✅'}</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Low Stock Alert</div>
                <div className={styles.statValue} style={{
                  background: stats.lowStockCount > 0 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                    : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{stats.lowStockCount}</div>
                <div className={styles.statDescription}>
                  {stats.lowStockCount > 0 ? 'Items need reorder' : 'All items stocked'}
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {stats.lowStockCount > 0 && (
            <div className={styles.card} style={{ border: '1px solid #fee2e2' }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon} style={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                }}>⚠️</div>
                <div>
                  <h3 className={styles.cardTitle} style={{ color: '#dc2626' }}>
                    Low Stock Alert
                  </h3>
                  <p className={styles.cardSubtitle}>
                    {stats.lowStockCount} items need immediate attention
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats.lowStockItems.slice(0, 5).map((item: any) => (
                  <div key={item.id} style={{ 
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    borderRadius: '0.75rem',
                    border: '1px solid #fecaca',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.25rem', wordBreak: 'break-word' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                        SKU: {item.sku}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: '#dc2626',
                        lineHeight: '1'
                      }}>
                        {item.quantity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
                        Reorder: {item.reorderLevel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products by Category */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📂</div>
              <div>
                <h3 className={styles.cardTitle}>Products by Category</h3>
                <p className={styles.cardSubtitle}>
                  Distribution across {stats.productsByCategory.length} categories
                </p>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div style={{ marginBottom: '2rem' }}>
              {stats.productsByCategory.map((cat: any, idx: number) => {
                const maxCount = Math.max(...stats.productsByCategory.map((c: any) => c.count));
                const percentage = (cat.count / maxCount) * 100;
                const gradients = [
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                ];
                const gradient = gradients[idx % gradients.length];
                
                return (
                  <div key={idx} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.75rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ 
                        fontSize: '0.9375rem', 
                        color: '#0f172a',
                        fontWeight: '600',
                        wordBreak: 'break-word',
                        flex: 1
                      }}>
                        {cat.categoryName || 'Uncategorized'}
                      </span>
                      <span style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '700', 
                        color: '#0f172a',
                        backgroundColor: '#f1f5f9',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        flexShrink: 0
                      }}>
                        {cat.count}
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '12px', 
                      backgroundColor: '#f1f5f9', 
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                    }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: gradient,
                        transition: 'width 0.5s ease',
                        borderRadius: '1rem'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '2px solid #f1f5f9'
            }}>
              {stats.productsByCategory.map((cat: any, idx: number) => {
                const icons = ['🎨', '📱', '🌶️', '👔', '☕'];
                const icon = icons[idx % icons.length];
                
                return (
                  <div key={idx} style={{ 
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                    <div style={{ 
                      fontSize: '0.8125rem',
                      color: '#64748b',
                      marginBottom: '0.25rem',
                      wordBreak: 'break-word'
                    }}>
                      {cat.categoryName || 'Uncategorized'}
                    </div>
                    <div style={{ 
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      {cat.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
