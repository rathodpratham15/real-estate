# Deploy on Railway

This app runs well on Railway as a Node + PostgreSQL service.

## 1) Push your code

Push your branch/repo to GitHub first.

## 2) Create services in Railway

1. Create a new Railway project.
2. Add your GitHub repo as a service.
3. Add a PostgreSQL service in the same project.

## 3) Configure build and start commands

In your app service settings:

- Build Command: `pnpm install --frozen-lockfile=false && pnpm build`
- Start Command: `pnpm start`

## 4) Set required environment variables

Add these env vars to the app service:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=${{PORT}}` (or leave unset if Railway injects `PORT`)
- `APP_KEY=<generate with "node ace generate:key">`
- `DB_HOST=<from Railway Postgres>`
- `DB_PORT=<from Railway Postgres>`
- `DB_USER=<from Railway Postgres>`
- `DB_PASSWORD=<from Railway Postgres>`
- `DB_DATABASE=<from Railway Postgres>`

Optional env vars (if features are enabled):

- `WHATSAPP_NUMBER`
- `GOOGLE_MAPS_API_KEY`
- `DEFAULT_MAP_LATITUDE`
- `DEFAULT_MAP_LONGITUDE`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `MAIL_FROM_ADDRESS`
- `MAIL_FROM_NAME`
- `ADMIN_EMAIL`

Use `.env.example` in this repo as the reference template.

## 5) Run migrations in production

After the first successful deploy, run:

`node ace migration:run --force`

You can run this from Railway's shell/CLI for the app service.

## 6) Redeploy and verify

1. Trigger a redeploy.
2. Open the generated Railway domain.
3. Verify homepage and key routes.

## Notes

- If deploy is successful but pages fail, check runtime logs for missing env vars.
- This repo currently has TypeScript issues in the source tree. Build can still pass because the current build script uses `--ignore-ts-errors`.
