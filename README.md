# UTECH Learning Platform

The UTECH Learning Platform is the new white + dark-blue learning experience for courses, lessons, quizzes, student progress, and account-based learning.

## Current stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- `@supabase/ssr` for cookie-based SSR authentication

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add the Supabase Project URL and Publishable Key.

3. In the Supabase SQL Editor, run:

```
supabase/schema.sql
```

4. In Supabase Auth settings, allow your local and deployed callback URLs:

```
http://localhost:3000/auth/callback
https://YOUR-DOMAIN/auth/callback
```

5. Start the app:

```bash
npm run dev
```

## Authentication

- Email/password sign-up and sign-in are implemented.
- Email confirmation returns through `/auth/callback`.
- `/dashboard` is protected by the Next.js 16 `proxy.ts` session refresh layer.
- Sign-out is available from the dashboard.

## Learning data

- Lesson completion is written to `lesson_progress` for authenticated users.
- Quiz attempts are written to `quiz_attempts`.
- Browser localStorage remains as a fallback when no authenticated backend session is available.

## Important

Supabase is scaffolded in the repository, but the project is not connected to a live Supabase instance until the environment variables and SQL schema are configured.
