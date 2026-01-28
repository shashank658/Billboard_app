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

## Build
```
npm run build
npm run start
```
