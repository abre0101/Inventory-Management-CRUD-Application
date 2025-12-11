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

  if (!stats) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '1rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>📊</div>
          <div style={{ color: '#94a3b8', fontSize: '1.125rem' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: 'white',
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '-0.02em'
            }}>
              📊 Analytics Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
              Real-time inventory insights and metrics
            </p>
          </div>
          <Link href="/" style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}>
            ← Back to Inventory
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.75rem', 
          marginBottom: '2.5rem' 
        }}>
          {/* Total Products Card */}
          <div style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              transform: 'rotate(-10deg)'
            }}>📦</div>
            <div style={{ position: 'relative', zIndex: 1, paddingRight: '100px' }}>
              <div style={{ 
                fontSize: '0.8125rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Total Products</div>
              <div style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                marginBottom: '0.75rem'
              }}>{stats.totalProducts}</div>
              <div style={{ 
                fontSize: '0.9375rem',
                color: '#94a3b8',
                fontWeight: '500'
              }}>Items in inventory</div>
            </div>
          </div>

          {/* Total Value Card */}
          <div style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
              transform: 'rotate(-10deg)'
            }}>💰</div>
            <div style={{ position: 'relative', zIndex: 1, paddingRight: '100px' }}>
              <div style={{ 
                fontSize: '0.8125rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Total Value</div>
              <div style={{ 
                fontSize: '2.25rem', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1.2',
                marginBottom: '0.75rem'
              }}>
                {parseFloat(stats.totalValue || 0).toLocaleString()} <span style={{ fontSize: '1.25rem' }}>Birr</span>
              </div>
              <div style={{ 
                fontSize: '0.9375rem',
                color: '#94a3b8',
                fontWeight: '500'
              }}>Inventory worth</div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '80px',
              height: '80px',
              background: stats.lowStockCount > 0 
                ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: stats.lowStockCount > 0 
                ? '0 8px 16px rgba(245, 158, 11, 0.3)'
                : '0 8px 16px rgba(6, 182, 212, 0.3)',
              transform: 'rotate(-10deg)'
            }}>{stats.lowStockCount > 0 ? '⚠️' : '✅'}</div>
            <div style={{ position: 'relative', zIndex: 1, paddingRight: '100px' }}>
              <div style={{ 
                fontSize: '0.8125rem', 
                color: '#64748b', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Low Stock Alert</div>
              <div style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                background: stats.lowStockCount > 0 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                marginBottom: '0.75rem'
              }}>{stats.lowStockCount}</div>
              <div style={{ 
                fontSize: '0.9375rem',
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                {stats.lowStockCount > 0 ? 'Items need reorder' : 'All items stocked'}
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockCount > 0 && (
          <div style={{ 
            background: 'white',
            padding: '2rem',
            borderRadius: '1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            marginBottom: '2rem',
            border: '1px solid #fee2e2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderRadius: '1rem',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}>⚠️</div>
              <div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#dc2626',
                  marginBottom: '0.25rem'
                }}>
                  Low Stock Alert
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.25rem' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                      SKU: {item.sku}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1rem',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>📂</div>
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#0f172a',
                marginBottom: '0.25rem'
              }}>
                Products by Category
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
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
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: '#0f172a',
                      fontWeight: '600'
                    }}>
                      {cat.categoryName || 'Uncategorized'}
                    </span>
                    <span style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700', 
                      color: '#0f172a',
                      backgroundColor: '#f1f5f9',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.5rem'
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #f1f5f9'
          }}>
            {stats.productsByCategory.map((cat: any, idx: number) => {
              const icons = ['🎨', '📱', '🌶️',  '👔', '☕'];
              const icon = icons[idx % icons.length];
              
              return (
                <div key={idx} style={{ 
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '0.25rem'
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
  );
}
