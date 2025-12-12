# 📦 Inventory Management System

A modern, real-time inventory management application built with Next.js 15, Supabase (PostgreSQL), and Drizzle ORM. Designed for small to medium businesses to efficiently track products, manage stock levels, monitor suppliers, and get instant updates across all connected devices.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🌟 Highlights

- ⚡ **Real-time Updates** - Instant synchronization using Supabase Realtime (WebSocket-based)
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 📊 **Analytics Dashboard** - Visual insights with export capabilities (CSV, JSON, Print)
- 🔒 **Type-Safe** - Full TypeScript coverage with Drizzle ORM
- 🚀 **Production Ready** - Deployed on Vercel with optimized performance

## ✨ Features

### 🔄 Real-Time Capabilities
- **Live Data Synchronization** - Changes reflect instantly across all connected devices
- **WebSocket Connection** - Powered by Supabase Realtime for sub-second updates
- **Multi-User Support** - Multiple users can work simultaneously without conflicts
- **Automatic Refresh** - No manual page refresh needed when data changes
- **Connection Status** - Visual indicators for real-time connection state

### 📦 Product Management
- **Full CRUD Operations** - Create, read, update, and delete products
- **SKU Auto-Generation** - Automatic SKU creation based on category prefixes
- **Detailed Product Info** - Name, description, price, quantity, unit, reorder levels
- **Category Assignment** - Organize products into customizable categories
- **Supplier Linking** - Associate products with suppliers for easy tracking
- **Stock Adjustments** - Three adjustment types:
  - **Stock In** - Add inventory (purchases, returns)
  - **Stock Out** - Remove inventory (sales, damages)
  - **Set Exact** - Override with precise count (physical inventory)

### 🏷️ Category & Supplier Management
- **Category Organization** - Create categories with custom SKU prefixes
- **Supplier Database** - Store contact info, email, phone, address
- **Category-Supplier Relationships** - Link suppliers to specific categories
- **Supplier Product View** - See all products from a specific supplier

### 📊 Analytics & Reporting
- **Visual Dashboard** - Real-time metrics and insights
  - Total products count
  - Total inventory value (in Birr)
  - Low stock alerts with item details
  - Products by category breakdown
- **Export Options**:
  - 📄 **CSV Export** - Spreadsheet-compatible format
  - 📋 **JSON Export** - API-ready structured data
  - 🖨️ **Print Report** - Professional print layout
- **Stock Movement History** - Complete audit trail with timestamps

### 📥 Data Import/Export
- **CSV Import** - Bulk upload products from spreadsheets
- **CSV Export** - Download entire inventory
- **Template Download** - Pre-formatted CSV template
- **Validation** - Automatic data validation during import
- **Error Handling** - Clear feedback on import issues

### 🎨 User Experience
- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Intuitive Navigation** - Easy-to-use menu system
- **Search & Filter** - Find products by name, SKU, category, or supplier
- **Low Stock Alerts** - Visual warnings for items below reorder level
- **Smooth Animations** - Polished transitions and hover effects
- **Button-Style Navigation** - Clear, clickable back buttons (not plain links)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd inventory-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the database to be provisioned (2-3 minutes)
   - Navigate to **Project Settings → API**
   - Copy your **Project URL** and **anon/public key**
   - Navigate to **Project Settings → Database**
   - Copy the **Connection String** (use the direct connection, port 5432)

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

5. **Initialize the database**

```bash
# Push the schema to Supabase
npm run db:push

# Seed with sample data (optional)
npx tsx scripts/seed.ts
```

6. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📁 Project Structure

```
inventory-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── categories/         # Category endpoints
│   │   ├── dashboard/          # Dashboard data
│   │   ├── inventory/          # Product CRUD + import/export
│   │   ├── products/           # Product endpoints
│   │   ├── stock-movements/    # Stock history
│   │   └── suppliers/          # Supplier endpoints
│   ├── components/             # React components
│   ├── dashboard/              # Dashboard page
│   ├── stock-movements/        # Stock history page
│   ├── suppliers/              # Suppliers page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main inventory page
│   └── globals.css             # Global styles
├── lib/
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Drizzle schema definitions
│   └── supabase.ts             # Supabase client
├── scripts/
│   └── seed.ts                 # Database seeding script
├── public/
│   └── inventory-template.csv  # CSV import template
└── drizzle.config.ts           # Drizzle configuration
```

## 🗄️ Database Schema

### Tables

**products**
- Product information (SKU, name, description)
- Pricing and quantity tracking
- Category and supplier relationships
- Reorder level management

**categories**
- Product categorization
- Description and metadata

**suppliers**
- Supplier contact information
- Business details

**stock_movements**
- Complete audit trail of inventory changes
- Movement types: in, out, adjustment
- Timestamps and notes

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio (GUI)

# Seeding
npx tsx scripts/seed.ts  # Seed database with sample data
```

## 📊 Usage Guide

### Managing Products

1. **Add a Product**: Click "➕ Add Product" button
2. **Edit a Product**: Click "✏️ Edit" in the product row
3. **Delete a Product**: Click "🗑️ Delete" (with confirmation)
4. **Adjust Stock**: Click "📊 Stock" to record stock movements

### Importing Products

1. Download the CSV template from the app
2. Fill in your product data
3. Click "📤 Import" and select your CSV file
4. Review the import results

### Exporting Data

Click "📥 Export" to download your entire inventory as a CSV file.

### Viewing Analytics

Navigate to the **Dashboard** to see:
- Total inventory value
- Low stock alerts
- Recent stock movements
- Category distribution

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`
   - Click "Deploy"

3. **Done!** Your app will be live in minutes.

### Alternative: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables via dashboard
```

## 🔧 Configuration

### Database Connection

The app uses two connection methods:
- **Supabase Client**: For real-time features and client-side operations
- **Direct PostgreSQL**: For server-side operations and migrations

Make sure to use port **5432** (direct connection) in your `DATABASE_URL` for best compatibility.

### ⚡ Real-Time Architecture

This application leverages **Supabase Realtime** for instant data synchronization:

#### How It Works

1. **WebSocket Connection**
   - Supabase Realtime uses WebSocket protocol for bidirectional communication
   - Establishes persistent connection between client and database
   - Sub-second latency for data updates

2. **Database Change Detection**
   - PostgreSQL's built-in replication features detect changes
   - Changes are captured at the database level (INSERT, UPDATE, DELETE)
   - Supabase broadcasts changes to all subscribed clients

3. **Client-Side Updates**
   - React components automatically re-fetch data when changes occur
   - UI updates instantly without manual refresh
   - Multiple users see changes in real-time

#### Real-Time Features in Action

- **Inventory Updates**: When one user adds/edits a product, all other users see it immediately
- **Stock Adjustments**: Stock changes reflect instantly across all dashboards
- **Low Stock Alerts**: Alert counts update in real-time as inventory changes
- **Dashboard Metrics**: Analytics update automatically as data changes

#### Technical Implementation

```typescript
// Supabase Realtime uses WebSocket under the hood
// Connection established via Supabase client
const supabase = createClient(url, key)

// Database changes trigger automatic UI updates
// No manual polling or refresh needed
```

#### Benefits

- ✅ **No Polling** - Efficient WebSocket connection instead of repeated API calls
- ✅ **Instant Updates** - Changes appear immediately (< 1 second)
- ✅ **Scalable** - Handles multiple concurrent users efficiently
- ✅ **Battery Friendly** - WebSocket uses less power than polling
- ✅ **Bandwidth Efficient** - Only sends data when changes occur

#### Enabling Real-Time in Supabase

Real-time is enabled by default, but verify in your Supabase dashboard:
1. Go to **Database** → **Replication**
2. Ensure tables have replication enabled
3. Check **API** → **Realtime** is active

## 📚 Tech Stack

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 15** | React framework with App Router | Server-side rendering, API routes, optimal performance |
| **TypeScript** | Type-safe development | Catch errors early, better IDE support, maintainable code |
| **Supabase** | PostgreSQL database & real-time | Managed database, WebSocket real-time, authentication ready |
| **Drizzle ORM** | Type-safe database queries | SQL-like syntax, full TypeScript support, migrations |
| **React 19** | UI library | Latest features, improved performance, better hooks |
| **PostgreSQL** | Relational database | ACID compliance, powerful queries, scalability |
| **WebSocket** | Real-time protocol | Bidirectional communication, instant updates, efficient |

### Architecture Diagram

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├─── HTTP/REST ───┐
         │                 │
         └─── WebSocket ───┤
                          │
                    ┌─────▼──────┐
                    │  Supabase  │
                    │  Realtime  │
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │ PostgreSQL │
                    │  Database  │
                    └────────────┘
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Connection Issues

If you get `ECONNREFUSED` errors:
- Ensure you're using port 5432 in `DATABASE_URL`
- Check that SSL is configured: `ssl: { rejectUnauthorized: false }`
- Verify your Supabase project is active

### Import Errors

If CSV import fails:
- Check that column names match the template
- Ensure SKUs are unique
- Verify category and supplier IDs exist

### Real-time Not Working

- Check that your Supabase project has real-time enabled
- Verify the table has replication enabled in Supabase dashboard

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

## 🎯 Roadmap

### Phase 1 - Core Features ✅
- [x] Product CRUD operations
- [x] Category management
- [x] Supplier management
- [x] Stock movement tracking
- [x] Real-time updates via WebSocket
- [x] CSV import/export
- [x] Dashboard analytics
- [x] Low stock alerts
- [x] Search and filtering

### Phase 2 - Enhanced Features 🚧
- [ ] Multi-user authentication (Supabase Auth)
- [ ] Role-based access control (Admin, Manager, Viewer)
- [ ] User activity logs
- [ ] Advanced filtering and sorting
- [ ] Batch operations (bulk edit/delete)

### Phase 3 - Advanced Features 📋
- [ ] Barcode scanning (mobile camera)
- [ ] Purchase order management
- [ ] Sales order tracking
- [ ] Supplier performance metrics
- [ ] Advanced reporting (PDF generation)
- [ ] Email notifications for low stock
- [ ] Multi-warehouse support

### Phase 4 - Mobile & Integration 🔮
- [ ] Progressive Web App (PWA)
- [ ] Native mobile app (React Native)
- [ ] REST API documentation
- [ ] Webhook integrations
- [ ] Third-party integrations (QuickBooks, Xero)

## 🏆 Key Achievements

- ⚡ **Real-time synchronization** using WebSocket technology
- 📊 **Production-ready** deployment on Vercel
- 🎨 **Modern UI/UX** with responsive design
- 🔒 **Type-safe** codebase with TypeScript
- 📈 **Scalable architecture** supporting multiple concurrent users
- 🚀 **Fast performance** with Next.js 15 optimizations

## 📸 Screenshots

### Main Inventory View
- Product listing with search and filters
- Real-time stock updates
- Quick actions (Edit, Delete, Adjust Stock)

### Analytics Dashboard
- Total products and inventory value
- Low stock alerts
- Category distribution charts
- Export options (CSV, JSON, Print)

### Stock Adjustment Modal
- Three adjustment types (In, Out, Set Exact)
- Reason and notes tracking
- Instant UI updates

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

**Built with ❤️ using Next.js, Supabase, and WebSocket technology**

*Perfect for small to medium businesses looking for a modern, real-time inventory management solution*
