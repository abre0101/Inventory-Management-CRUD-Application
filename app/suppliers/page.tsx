'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back to Inventory
          </Link>
          <h1 className={styles.title}>
            🏢 Suppliers & Products
          </h1>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.grid}>
            {/* Suppliers List */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Suppliers</h2>
              <div className={styles.suppliersList}>
                {suppliers.length === 0 ? (
                  <p className={styles.emptyState}>No suppliers found</p>
                ) : (
                  suppliers.map((supplier) => (
                    <button
                      key={supplier.id}
                      onClick={() => setSelectedSupplier(supplier.id)}
                      className={`${styles.supplierButton} ${selectedSupplier === supplier.id ? styles.active : ''}`}
                    >
                      <div className={styles.supplierName}>{supplier.name}</div>
                      {supplier.contactPerson && (
                        <div className={styles.supplierContact}>{supplier.contactPerson}</div>
                      )}
                      {supplier.email && (
                        <div className={styles.supplierEmail}>{supplier.email}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Supplier Products */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Products</h2>
              {!selectedSupplier ? (
                <p className={styles.emptyState}>Select a supplier to view their products</p>
              ) : supplierProducts.length === 0 ? (
                <p className={styles.emptyState}>No products found for this supplier</p>
              ) : (
                <div className={styles.productsList}>
                  {supplierProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productHeader}>
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productSku}>SKU: {product.sku}</div>
                          {product.description && (
                            <div className={styles.productDescription}>{product.description}</div>
                          )}
                        </div>
                        <div className={styles.productPrice}>
                          <div className={styles.priceValue}>
                            {parseFloat(product.price).toFixed(2)} Birr
                            <span className={styles.priceUnit}>per {product.unit || 'piece'}</span>
                          </div>
                          <div className={styles.productStock}>Stock: {product.quantity}</div>
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
