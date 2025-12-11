# Inventory Management App

A full-stack CRUD application built with Next.js, Supabase, and Drizzle ORM.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy your project URL and anon key
4. Go to Project Settings > Database and copy the connection string

### 3. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url
```

### 4. Push Database Schema

```bash
npm run db:push
```

This will create the inventory table in your Supabase database.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the same environment variables from `.env.local`

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
6. Click "Deploy"

## Features

- ✅ Create inventory items
- ✅ Read/List all items
- ✅ Update existing items
- ✅ Delete items
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe database queries with Drizzle ORM
- ✅ PostgreSQL database via Supabase

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel
