'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchSupplierProducts(selectedSupplier);
    }
  }, [selectedSupplier]);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierProducts = async (supplierId: number) => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/products`);
      const data = await res.json();
      setSupplierProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching supplier products:', error);
      setSupplierProducts([]);
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
            Suppliers & Products
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            {/* Suppliers List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                Suppliers
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suppliers.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                    No suppliers found
                  </p>
                ) : (
                  suppliers.map((supplier) => (
                    <button
                      key={supplier.id}
                      onClick={() => setSelectedSupplier(supplier.id)}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: selectedSupplier === supplier.id ? '#eff6ff' : 'white',
                        borderColor: selectedSupplier === supplier.id ? '#2563eb' : '#e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {supplier.name}
                      </div>
                      {supplier.contactPerson && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {supplier.contactPerson}
                        </div>
                      )}
                      {supplier.email && (
                        <div style={{ fontSize: '0.875rem', color: '#2563eb' }}>
                          {supplier.email}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Supplier Products */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                Products
              </h2>
              {!selectedSupplier ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                  Select a supplier to view their products
                </p>
              ) : supplierProducts.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                  No products found for this supplier
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {supplierProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                            SKU: {product.sku}
                          </div>
                          {product.description && (
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                              {product.description}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                            {parseFloat(product.price).toFixed(2)} Birr
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', display: 'block' }}>
                              per {product.unit || 'piece'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Stock: {product.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
