# Quillbyte

> Ideas worth shipping.

Quillbyte is a modern editorial platform for thoughtful engineering, product,
and technology writing. It combines a public reading experience with secure
author dashboards, an admin content workspace, AI-assisted post generation,
bookmarks, comments, notifications, search, media management, and analytics.

## What It Includes

- Responsive public blog, categories, tags, authors, search, and RSS-ready routes
- Better Auth email/password authentication with role-aware admin access
- Admin workspace for posts, categories, tags, users, media, comments, and reports
- Author dashboard for creating, editing, publishing, and scheduling posts
- Rich text editing with AI-assisted article generation
- Five AI post generations per user per calendar month
- Bookmarks, likes, comments, reading history, follows, and notifications
- Prisma data access with PostgreSQL
- Cloudinary image uploads and Resend transactional email support
- Light and dark themes with a responsive Quillbyte design system

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Data | Prisma 7, PostgreSQL, `@prisma/adapter-pg` |
| Authentication | Better Auth |
| Client state | TanStack Query, Zustand |
| AI | Google Gemini |
| Media | Cloudinary |
| Email | Resend |

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Neon
- Optional: Cloudinary, Gemini, and Resend accounts for those features

## Quick Start

1. Install dependencies:

	```powershell
	npm install
	```

2. Create a local environment file:

	```powershell
	Copy-Item .env.example .env
	```

3. Configure `DATABASE_URL` and the required application secrets in `.env`.

4. Generate the Prisma client and apply migrations:

	```powershell
	npx prisma generate
	npx prisma migrate deploy
	```

	For local schema experimentation, `npx prisma db push` can be used instead
	of migrations.

5. Seed the initial users, categories, tags, and admin-owned posts:

	```powershell
	npm run seed
	```

6. Start the development server:

	```powershell
	npm run dev
	```

Open [http://localhost:3000](http://localhost:3000).

For Vercel deployments, the `vercel-build` script automatically runs
`prisma migrate deploy` before `next build`. Add the same `DATABASE_URL` used
by the application to the Vercel project environment variables.

## Environment Variables

At minimum, configure:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
```

Optional integrations use the variables documented in `.env.example`:

- `GEMINI_API_KEY` for AI post generation
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY` and `EMAIL_FROM`
- OAuth provider credentials
- `ARCJET_KEY` and `ARCJET_ENV`

Never commit `.env` or place real secrets in documentation. Rotate any secret
that has been exposed in source control, logs, screenshots, or chat.

## Database and Seeding

The application uses Prisma with PostgreSQL. The migration history is stored in
`prisma/migrations` and the schema is defined in `prisma/schema.prisma`.

The seed command is intentionally limited to foundational content:

- Creates or repairs the initial admin and sample users
- Creates categories and tags
- Creates posts owned by the admin user
- Starts seeded posts with zero views
- Does not create fake likes, comments, bookmarks, follows, history,
  subscribers, activity logs, or view counts

Real engagement is created only through application actions.

## Authentication

Admin pages and admin API routes require an authenticated user with the
`ADMIN` role. The initial admin values come from `ADMIN_EMAIL` and
`ADMIN_PASSWORD` when the seed runs.

After changing those values, rerun the seed only when you intend to repair or
initialize the corresponding account. Use strong, unique credentials in every
environment.

## AI Generation

The post editor sends a title to `/api/ai/generate-post`. The server validates
the request, calls Gemini, and stores a monthly usage counter per user. Each
user receives five successful generations per UTC calendar month. A request
after the limit returns:

```text
Credit Insufficient
```

Failed provider responses release the reserved generation credit.

## Useful Commands

```powershell
npm run dev              # Start the development server
npm run build            # Create a production build
npm run start            # Serve the production build
npm run lint             # Run ESLint
npm run seed             # Seed foundational application data
npx prisma studio        # Browse the database locally
npx prisma generate      # Regenerate the Prisma client
npx prisma migrate deploy
```

## Project Structure

```text
src/app/                 Next.js routes, layouts, pages, and API handlers
src/components/          Reusable UI and editor components
src/services/            Client and server service layers
src/lib/                 Auth, API, email, AI, storage, and shared utilities
src/module/              Feature-oriented server modules
src/store/               Zustand stores
src/types/               Shared TypeScript types
prisma/schema.prisma     PostgreSQL data model
prisma/migrations/       Versioned database migrations
prisma/seeds/            Foundational seed modules
public/                  Static assets, including the Quillbyte icon
```

## Production Checklist

- Use a managed PostgreSQL database and verify migrations before deployment.
- Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the production origin.
- Replace every development secret with a production secret.
- Configure a verified email sender for Resend.
- Configure Cloudinary upload restrictions and production credentials.
- Configure Gemini usage limits and monitor AI errors.
- Run `npm run build` before release.
- Do not run the seed command against production unless the intended data
  repair has been reviewed.

## License

This project is private and intended for its owning team. Add a license before
redistributing it.
