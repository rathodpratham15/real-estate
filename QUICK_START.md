# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd real-estate-website
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env
node ace generate:key
# Copy the generated key to .env file
```

### 3. Configure Database
Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=real_estate_db
```

### 4. Create Database
```sql
CREATE DATABASE real_estate_db;
```

### 5. Run Migrations
```bash
node ace migration:run
```

### 6. Start Server
```bash
pnpm dev
```

Visit: **http://localhost:3334**

## ✅ That's It!

Your real estate website is now running independently with its own database.

## 📝 Routes

- `/` - Home
- `/listings` - Properties
- `/listings/:slug` - Property detail
- `/blog` - Blog posts
- `/blog/:slug` - Blog post detail
- `/about` - About page
- `/contact` - Contact page

## 🔧 Next Steps

1. Add seed data for properties, agents, blog posts
2. Configure email for contact form
3. Upload property images
4. Customize branding and colors
