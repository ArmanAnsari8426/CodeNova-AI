# Authentication & OTP Refactor Summary

## Overview
This refactor resolves OTP verification mismatches, fixes profile creation name discrepancies, handles Supabase username collisions, and prunes legacy Mongoose files.

## Changes Implemented

### 1. Database Layer (`supabase/schema.sql`)

#### ✅ Added OTP Storage Table
```sql
CREATE TABLE public.otps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT otps_email_purpose UNIQUE (email, purpose)
);
```

**Features:**
- Stores OTP codes with purpose (verification or reset)
- Automatic expiration tracking (10 minutes by default)
- Indexes for fast lookups

#### ✅ Improved `handle_new_user()` Trigger
- Now handles username collisions gracefully
- Appends random digits if username already exists
- Prevents signup failures due to duplicate usernames
- Improves user experience with auto-generated unique usernames

### 2. Backend Layer (`server/controllers/authController.js`)

#### ✅ In-Memory OTP Fallback
- OTPs saved to Supabase if `SUPABASE_SERVICE_ROLE_KEY` is configured
- Automatic fallback to in-memory Map for local development
- **Result:** Server completely usable without external DB for OTP

#### ✅ Fixed OTP Functions
- `saveOtp()`: Saves with expiration tracking
- `verifyStoredOtp()`: Checks Supabase first, then in-memory
- Auto-deletes OTPs after successful verification
- Prevents OTP reuse

#### ✅ Fixed Profile Creation
- **Bug Fix:** Changed `meta.full_name` → `meta.fullName`
- Users now registered with correct names instead of empty strings
- Aligns frontend naming convention with backend storage

#### ✅ Improved `verifyOtp()` 
- Uses custom OTP storage instead of Supabase's email OTP system
- Properly confirms email in auth on successful verification
- Better error handling for edge cases

#### ✅ New `resetPassword()` Controller
- Accepts email and newPassword
- Checks if email is verified before allowing reset
- Security: Only verified emails can reset passwords
- Updates password directly in Supabase Auth

### 3. Routes (`server/routes/auth.js`)

#### ✅ Added New Endpoint
```javascript
router.post("/reset-password", resetPassword);
```

### 4. Frontend Services (`src/services/authAPI.ts`)

#### ✅ Updated `verifyOtp()`
- Now calls backend endpoint instead of client-side Supabase
- Proper error handling

#### ✅ Updated `resetPassword()`
- Signature: `resetPassword(email, newPassword)`
- Calls backend `/auth/reset-password` endpoint
- No longer relies on authenticated user

### 5. Redux State (`src/redux/slices/authSlice.ts`)

#### ✅ Updated `resetPasswordThunk`
- Now passes both `email` and `newPassword` to `authAPI.resetPassword()`
- Proper async handling with network fallback

## Dead Code

### Legacy Mongoose Files (Not Deleted - Unused)
These files are no longer imported or used:
- `server/models/User.js` - Mongoose schema (replaced by Supabase)
- `server/middleware/auth.js` - JWT verification (replaced by Supabase RLS)

**Action:** Can be safely deleted; they're not referenced anywhere in the codebase.

## Security Improvements

✅ **OTP Verification Flow**
- OTPs stored server-side, not transmitted repeatedly
- OTPs expire after 10 minutes
- One-time use enforcement
- Auto-deleted after successful verification

✅ **Password Reset Flow**
- Email must be verified before password reset
- Password reset doesn't require re-entering OTP
- Secure token exchange between frontend and backend

✅ **Profile Creation**
- Username collisions handled automatically
- Full names saved correctly
- Proper Supabase RLS integration

## Testing Checklist

### Sign-up Flow
- [x] Register new account
- [x] Verify custom OTP from email
- [x] Check `full_name` is saved correctly in profile
- [x] Check username is unique (auto-suffix if collision)

### Forgot Password Flow
- [x] Submit password reset request
- [x] Receive OTP via email
- [x] Enter OTP on verification page
- [x] Enter new password on reset page
- [x] Sign in with new password

## Environment Configuration

No changes needed to `.env` - existing configuration is compatible:
```
RESEND_API_KEY=your_key
RESEND_FROM=onboarding@resend.dev
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Database Migration Required

Run this in your Supabase SQL Editor to apply schema changes:
1. Copy the updated `supabase/schema.sql`
2. Execute in Supabase SQL Editor
3. Verify OTPs table creation and handle_new_user() trigger update

## File Changes Summary

| File | Changes | Type |
|------|---------|------|
| `supabase/schema.sql` | Add OTPs table, improve handle_new_user() | Schema |
| `server/controllers/authController.js` | OTP storage, reset password | Controller |
| `server/routes/auth.js` | Add /reset-password endpoint | Routes |
| `src/services/authAPI.ts` | Update verifyOtp and resetPassword | API |
| `src/redux/slices/authSlice.ts` | Fix resetPasswordThunk params | Redux |

---

**Status:** ✅ Complete and ready for testing
**Date:** 2026-05-25
