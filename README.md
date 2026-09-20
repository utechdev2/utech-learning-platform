# UTECH Learning Platform

The UTECH Learning Platform is the new white + dark-blue learning experience for courses, lessons, quizzes, student progress, and account-based learning.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- `@supabase/ssr` for cookie-based SSR authentication

## Supabase backend

The repository is now backed by the connected UTECH Supabase project:

- Project ref: `apcumwboaexfrnltomwp`
- Region: `eu-west-3`
- API URL: `https://apcumwboaexfrnltomwp.supabase.co`

The database contains:

- `public.profiles`
- `public.lesson_progress`
- `public.quiz_attempts`

All three tables have Row Level Security enabled. Users can only access their own profile, lesson progress, and quiz attempts.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local`.

3. Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://apcumwboaexfrnltomwp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Use the Supabase publishable key for this project. Never commit `.env.local` or a secret/service-role key.

4. The production database schema has already been applied. For a fresh Supabase project, the equivalent schema is stored in `supabase/schema.sql`.

5. In Supabase Auth settings, allow these callback URLs:

```text
http://localhost:3000/auth/callback
https://YOUR-DOMAIN/auth/callback
```

6. Start the app:

```bash
npm run dev
```

## Authentication

- Email/password sign-up and sign-in are implemented.
- Sign-up stores the user's full name in auth metadata.
- A database trigger creates the matching `profiles` row.
- Email confirmation returns through `/auth/callback`.
- `/dashboard` is protected by the Next.js 16 `proxy.ts` session refresh layer.
- Sign-in safely preserves a valid internal `next` destination.
- Sign-out is available from the dashboard.

## Learning data

- Lesson completion is persisted in `lesson_progress` for authenticated users.
- Quiz attempts are persisted in `quiz_attempts`.
- Browser localStorage remains as a fallback when no authenticated backend session is available.

## Current status

The Supabase database foundation is live and has been verified with no current security or performance advisor findings.

The remaining deployment step is to provide the publishable key through the local/deployment environment and configure the deployed Auth callback URL. No Supabase secret/service-role key is required by the current frontend architecture.
