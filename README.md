# Billboard App

Barebone Next.js App Router setup ready for Vercel.

## Requirements
- Node.js 18+

## Environment Variables
Copy `.env.example` to `.env` and fill in values.

```
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public base URL for the app (used in UI) |
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `SEED_ADMIN_EMAIL` | Optional: seed admin email for local bootstrap |
| `SEED_ADMIN_NAME` | Optional: seed admin name for local bootstrap |

## Development
```
npm install
npm run dev
```

## Database (Drizzle + Neon)
```
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Auth (Clerk)
- Create your first admin by setting `SEED_ADMIN_EMAIL` + `SEED_ADMIN_NAME` and running `npm run db:seed`.
- Create the matching user in Clerk (Dashboard) or via invitation; the first sign-in will link the Clerk user to the DB record.

## Build
```
npm run build
npm run start
```
