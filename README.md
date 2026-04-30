# Real Estate Website

A standalone real estate website built with AdonisJS 6, Inertia.js, and React.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd real-estate-website
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Generate an app key:

```bash
node ace generate:key
```

Update `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=real_estate_db

# WhatsApp (optional - for click-to-chat functionality)
# Format: +919876543210 (include country code)
WHATSAPP_NUMBER=+919876543210

# Email Configuration (for admin notifications)
# SMTP settings for sending email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@realest.com
MAIL_FROM_NAME=Realest
ADMIN_EMAIL=admin@realest.com
```

### 3. Create the Database

```sql
CREATE DATABASE real_estate_db;
```

### 4. Run Migrations

```bash
node ace migration:run
```

This will create the following tables:
- `agents`
- `properties`
- `blog_posts`
- `testimonials`

### 5. Start Development Server

```bash
pnpm dev
```

Visit: `http://localhost:3334`

## 📁 Project Structure

```
real-estate-website/
├── app/
│   ├── controllers/     # Controllers
│   ├── models/          # Database models
│   ├── exceptions/      # Exception handlers
│   └── middleware/      # Middleware
├── config/              # Configuration files
├── database/
│   └── migrations/      # Database migrations
├── inertia/
│   ├── app/            # Inertia app setup
│   ├── components/     # React components
│   ├── pages/         # React pages
│   └── lib/           # TypeScript types
├── public/            # Static assets
├── resources/
│   └── views/         # Edge templates
└── start/
    ├── kernel.ts      # HTTP kernel
    └── routes/        # Route definitions
```

## 🗄️ Database

The application uses PostgreSQL. Make sure PostgreSQL is running and create a separate database for this application.

## 📝 Routes

- `GET /` - Home page
- `GET /listings` - Property listings
- `GET /listings/:slug` - Property detail
- `GET /blog` - Blog listing
- `GET /blog/:slug` - Blog post detail
- `GET /about` - About page
- `GET /contact` - Contact page
- `POST /contact` - Contact form submission

## 🛠️ Available Commands

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm migrate` - Run migrations
- `pnpm migrate:rollback` - Rollback last migration
- `pnpm migrate:fresh` - Drop all tables and re-run migrations
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm typecheck` - Type check TypeScript

## 🔧 Configuration

### Database

Edit `config/database.ts` to configure your database connection.

### Inertia

Edit `config/inertia.ts` to configure Inertia.js settings.

### Vite

Edit `vite.config.ts` to configure Vite and build settings.

## 📦 Dependencies

### Core
- AdonisJS 6
- Inertia.js
- React 19
- PostgreSQL
- Tailwind CSS

### UI
- Lucide React (icons)
- Sonner (toasts)

## 🎨 Styling

The application uses Tailwind CSS. Styles are in `inertia/css/app.css`.

## 📄 License

Private - All rights reserved
