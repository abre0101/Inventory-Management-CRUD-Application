# 📦 Inventory Management System

A modern, full-featured inventory management application built with Next.js 15, Supabase, and Drizzle ORM. Perfect for small to medium businesses looking to track products, manage stock levels, and monitor suppliers.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

### Core Functionality
- 📊 **Product Management** - Create, read, update, and delete products with detailed information
- 🏷️ **Category Organization** - Organize products into customizable categories
- 🏢 **Supplier Tracking** - Manage supplier information and relationships
- 📈 **Stock Movement History** - Track all inventory changes with detailed logs
- ⚠️ **Low Stock Alerts** - Automatic warnings when products reach reorder levels
- 🔍 **Advanced Search & Filtering** - Search by name, SKU, or description with category filters

### Data Management
- 📥 **CSV Export** - Export your entire inventory to CSV format
- 📤 **CSV Import** - Bulk import products from CSV files
- 📄 **Template Download** - Pre-formatted CSV template for easy imports
- 🔄 **Real-time Updates** - Live data synchronization across all clients

### User Experience
- 🎨 **Modern UI Design** - Clean, professional interface with intuitive navigation
- 📱 **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- 🌐 **Dashboard Analytics** - Visual insights into inventory status and trends
- ⚡ **Fast Performance** - Optimized for speed with Next.js 15 App Router

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

### Real-time Features

Real-time updates are enabled by default. The app subscribes to database changes and automatically refreshes the UI when products are modified.

## 📚 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | PostgreSQL database & real-time |
| **Drizzle ORM** | Type-safe database queries |
| **Tailwind CSS** | Utility-first styling |
| **React 19** | UI library |

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

- [ ] Multi-user authentication
- [ ] Role-based access control
- [ ] Barcode scanning
- [ ] Purchase order management
- [ ] Advanced reporting
- [ ] Mobile app

---

Built with ❤️ using Next.js and Supabase
