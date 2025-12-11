'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Inventory' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/stock-movements', label: 'Stock History' },
    { href: '/suppliers', label: 'Suppliers' },
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      marginBottom: '2rem',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
            Inventory System
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: pathname === link.href ? '#2563eb' : '#6b7280',
                  textDecoration: 'none',
                  fontWeight: pathname === link.href ? '600' : '400',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0',
                  borderBottom: pathname === link.href ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
