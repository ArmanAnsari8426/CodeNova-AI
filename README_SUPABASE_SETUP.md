# CodeNova AI — Supabase Migration Setup

This project has been migrated from a MongoDB-style architecture to a **Supabase-ready architecture**.

## What changed

### Frontend
- Uses `@supabase/supabase-js`
- Auth is handled by **Supabase Auth**
- User profile data is stored in the `profiles` table
- OAuth uses Supabase's built-in Google and GitHub providers
- Password reset and OTP can use Supabase email auth flows

### Backend
- MongoDB/Mongoose has been removed from the active architecture
- Backend is now optional and mainly used for:
  - health checks
  - Resend email actions
  - secure server-side custom APIs
  - Supabase service-role operations

---

## 1. Create Supabase Project

Go to: https://supabase.com

Create a project and copy:
- `Project URL`
- `anon public key`
- `service_role key`

---

## 2. Run Schema

Open Supabase SQL Editor and run:

`supabase/schema.sql`

This will create:
- `public.profiles`
- triggers for auto profile creation
- RLS policies
- indexes

---

## 3. Enable Providers

### Email Auth
Supabase Dashboard → Authentication → Providers → Email
- Enable email auth
- Enable email confirmations if desired

### Google OAuth
Supabase Dashboard → Authentication → Providers → Google
- Enable Google
- Add Client ID / Client Secret
- Add redirect URL from Supabase

### GitHub OAuth
Supabase Dashboard → Authentication → Providers → GitHub
- Enable GitHub
- Add Client ID / Client Secret
- Add redirect URL from Supabase

---

## 4. Frontend Env

Set these in your frontend environment:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=CodeNova AI
```

---

## 5. Backend Env

Set these in `server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=onboarding@resend.dev
CLIENT_URL=http://localhost:5173
```

---

## 6. What the auth flow now looks like

### Signup
1. Frontend calls `supabase.auth.signUp()`
2. Supabase creates user in `auth.users`
3. DB trigger auto-creates row in `public.profiles`
4. User verifies email (if enabled)
5. App loads profile from `profiles`

### Login
1. Frontend calls `supabase.auth.signInWithPassword()`
2. Session stored by Supabase
3. Profile fetched from `profiles`
4. Redux stores normalized profile

### Google / GitHub
1. Frontend calls `supabase.auth.signInWithOAuth()`
2. Supabase redirects to provider
3. User comes back authenticated
4. Profile row auto-created by trigger
5. App fetches profile and stores it

---

## 7. Important Note

Some legacy demo fallback code is still kept so the UI keeps working even if Supabase is not configured yet. Once your real Supabase keys are set, the live auth flow will use Supabase.

---

## 8. Recommended Next Step

If you want, the next best upgrade is:
- remove old demo fallback completely
- add real Supabase session listener in `App.tsx`
- add protected route checks using real Supabase session state
- add profile sync after OAuth redirect

If you want that, I can do the final Supabase production pass too.
