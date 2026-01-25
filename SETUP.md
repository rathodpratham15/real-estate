# Complete Setup Guide

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 12+
- Git

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd real-estate-website
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Generate app key:
```bash
node ace generate:key
```

Copy the generated key to `.env`:
```env
APP_KEY=your-generated-key-here
```

### 3. Database Setup

#### Create Database

```sql
CREATE DATABASE real_estate_db;
```

#### Update .env

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=real_estate_db
```

### 4. Run Migrations

```bash
node ace migration:run
```

### 5. Start Development Server

```bash
pnpm dev
```

The server will start on `http://localhost:3334`

## Production Deployment

### Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE real_estate_db;`

### Port Already in Use

Change the port in `.env`:
```env
PORT=3335
```

### Migration Errors

Reset database:
```bash
node ace migration:fresh
```

## Next Steps

1. Add seed data (create seeders for sample properties, agents, etc.)
2. Configure email service for contact form
3. Set up image upload/storage
4. Customize styling and branding
