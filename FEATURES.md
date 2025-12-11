# Inventory Management System - Features Documentation

## Overview
This inventory management system provides comprehensive CRUD operations for products, stock tracking, supplier management, and reporting capabilities.

## ✅ Implemented Features

### 1. Stock Adjustment Operations (FR9, FR10, FR14)

**Location:** Main inventory page - "Stock" button on each product

**Features:**
- **Stock In**: Add inventory to existing products
- **Stock Out**: Remove inventory from products
- **Set Exact Quantity**: Adjust to a specific quantity
- **Reason Tracking**: Record why stock was adjusted
- **Notes**: Add detailed notes for each adjustment

**Usage:**
1. Click the "Stock" button next to any product
2. Select adjustment type (In/Out/Adjustment)
3. Enter quantity
4. Optionally add reason and notes
5. Submit to update stock and create movement record

**API Endpoint:** `POST /api/stock-movements`

---

### 2. Stock Movement History (FR11)

**Location:** `/stock-movements` page

**Features:**
- Complete history of all stock adjustments
- Shows product name, SKU, type, quantity, reason, and notes
- Color-coded by movement type:
  - 🟢 Green: Stock In
  - 🔴 Red: Stock Out
  - 🔵 Blue: Adjustment
- Timestamp for each movement

**API Endpoint:** `GET /api/stock-movements`

---

### 3. CSV Import/Export (FR7)

**Location:** Main inventory page - Top right buttons

#### Export
- **Button:** "📥 Export CSV"
- Exports all products with complete details
- Includes: SKU, Name, Description, Category, Supplier, Price, Quantity, Reorder Level
- Filename format: `inventory-export-YYYY-MM-DD.csv`

**API Endpoint:** `GET /api/inventory/export`

#### Import
- **Button:** "📤 Import CSV"
- Bulk import products from CSV file
- Automatically matches categories and suppliers by name
- Shows success/error count after import
- Handles errors gracefully (continues importing valid rows)

**CSV Format:**
```csv
SKU,Name,Description,Category,Supplier,Price,Quantity,Reorder Level
PROD-001,"Product Name","Description","Category Name","Supplier Name",99.99,50,10
```

**Template:** Download sample template using "📄 Template" button

**API Endpoint:** `POST /api/inventory/import`

---

### 4. Category Distribution Chart (FR27)

**Location:** `/dashboard` page

**Features:**
- Visual bar chart showing product distribution across categories
- Color-coded bars for easy identification
- Shows both percentage (bar) and count (number)
- Responsive design
- List view below chart for detailed numbers

**Colors:**
- Blue (#2563eb)
- Purple (#7c3aed)
- Green (#059669)
- Red (#dc2626)
- Orange (#f59e0b)
- Cyan (#06b6d4)

---

### 5. Products by Supplier View (FR22)

**Location:** `/suppliers` page

**Features:**
- Two-panel layout:
  - Left: List of all suppliers with contact info
  - Right: Products for selected supplier
- Click any supplier to view their products
- Shows product details: name, SKU, description, price, stock
- Highlights selected supplier
- Responsive design

**API Endpoint:** `GET /api/suppliers/{id}/products`

---

## Navigation

All pages are accessible via:
- Top navigation links on each page
- Direct URLs:
  - `/` - Main inventory page
  - `/dashboard` - Dashboard with metrics
  - `/stock-movements` - Stock history
  - `/suppliers` - Supplier-product view

---

## API Endpoints Summary

### Stock Movements
- `GET /api/stock-movements` - Get all movements
- `POST /api/stock-movements` - Create movement and update product quantity

### Import/Export
- `GET /api/inventory/export` - Export all products as CSV
- `POST /api/inventory/import` - Import products from CSV (multipart/form-data)

### Suppliers
- `GET /api/suppliers/{id}/products` - Get products for specific supplier

---

## Database Schema

All features use existing schema:

```typescript
// Stock movements table
stockMovements {
  id: serial
  productId: integer (FK to products)
  type: 'in' | 'out' | 'adjustment'
  quantity: integer
  reason: text (optional)
  notes: text (optional)
  createdAt: timestamp
}
```

---

## User Workflows

### Adding Stock
1. Navigate to main inventory page
2. Find product and click "Stock"
3. Select "Stock In (Add)"
4. Enter quantity and reason
5. Submit

### Viewing Stock History
1. Click "Stock History" in navigation
2. View all movements with filters
3. See product details, type, and timestamps

### Bulk Import
1. Download template CSV
2. Fill in product data
3. Click "Import CSV"
4. Select your file
5. Review import results

### Viewing Supplier Products
1. Navigate to "Suppliers" page
2. Click on any supplier
3. View all products from that supplier
4. See pricing and stock levels

---

## Real-time Updates

The system uses Supabase real-time subscriptions to automatically update the inventory list when:
- Products are added/updated/deleted
- Stock is adjusted
- Imports are completed

No page refresh needed!

---

## Error Handling

- CSV import continues on errors and reports failed rows
- Stock adjustments validate quantity
- Confirmation dialogs for destructive actions
- User-friendly error messages
- Loading states for async operations

---

## Mobile Responsive

All features are fully responsive:
- Tables scroll horizontally on mobile
- Buttons stack vertically when needed
- Modal dialogs adapt to screen size
- Touch-friendly button sizes
