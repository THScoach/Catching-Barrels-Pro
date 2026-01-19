# CatchBarrels Swing Analysis App

## Setup

1. Deploy to Vercel
2. Add Vercel Postgres database from Storage tab
3. Run database migration: `npx prisma db push`
4. Visit `/api/seed` to create test users
5. Login with:
   - Admin: admin@catchbarrels.app / admin123
   - Player: player@test.com / player123

## Environment Variables (auto-set by Vercel Postgres)

- POSTGRES_PRISMA_URL
- POSTGRES_URL_NON_POOLING
- NEXTAUTH_SECRET (set manually)
- NEXTAUTH_URL (set manually to your domain)
