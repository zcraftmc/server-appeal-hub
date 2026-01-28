# Quick Reference - Supabase Appeal Integration

## TL;DR - Getting Started

### 1. Copy the SQL (2 minutes)
```
File: SQL_SETUP.sql
→ Copy entire contents
```

### 2. Create Table in Supabase (1 minute)
```
1. Go to: https://app.supabase.com → Your Project
2. SQL Editor → New Query
3. Paste the SQL file contents
4. Click "Run"
```

### 3. Done! ✅
Appeals now save to Supabase automatically when submitted.

---

## What Changed?

| Before | After |
|--------|-------|
| localStorage only | localStorage + Supabase |
| Data not persisted | Data saved to database |
| No admin view | Can query appeals in Supabase |
| Manual tracking | Automatic timestamps + tracking |

---

## Database Schema

```
ban_appeals table:
├── id (UUID) - Unique ID
├── username (VARCHAR) - Minecraft username
├── discord_tag (VARCHAR) - Discord tag
├── email (VARCHAR) - Email address
├── ban_reason (VARCHAR) - Why they were banned
├── appeal_reason (TEXT) - Their explanation
├── additional_info (TEXT) - Optional notes
├── status (VARCHAR) - pending/approved/denied/under_review
├── response (TEXT) - Admin response
├── handled_by (UUID) - Admin who handled it
├── created_at (TIMESTAMP) - When submitted
├── updated_at (TIMESTAMP) - Last updated
├── handled_at (TIMESTAMP) - When handled
├── webhook_sent (BOOLEAN) - Webhook notification sent?
└── user_agent (TEXT) - Browser info
```

---

## Test It

1. Submit an appeal from the form
2. Open Supabase → Table Editor → ban_appeals
3. You should see the new entry in real-time ✨

---

## Query Examples

### In Supabase SQL Editor

Get pending appeals:
```sql
SELECT * FROM ban_appeals WHERE status = 'pending' ORDER BY created_at DESC;
```

Get appeals from today:
```sql
SELECT * FROM ban_appeals WHERE DATE(created_at) = CURRENT_DATE;
```

Get by username:
```sql
SELECT * FROM ban_appeals WHERE username = 'PlayerName';
```

Count by status:
```sql
SELECT status, COUNT(*) FROM ban_appeals GROUP BY status;
```

---

## Code Examples

### In Your App

Get all appeals (frontend):
```typescript
import { getAllAppeals } from "@/integrations/supabase/appeals";

const appeals = await getAllAppeals();
```

Get specific appeal:
```typescript
import { getAppealById } from "@/integrations/supabase/appeals";

const appeal = await getAppealById("appeal-uuid");
```

Update appeal status (backend):
```typescript
import { updateAppealStatus } from "@/integrations/supabase/appeals";

await updateAppealStatus(
  "appeal-uuid",
  "approved",
  "Your appeal has been approved! Welcome back.",
  "admin-uuid"
);
```

---

## Important Notes

✅ **Already Configured:**
- Supabase client is set up in `src/integrations/supabase/client.ts`
- All credentials are already there
- No additional .env vars needed

✅ **What Works Now:**
- Appeals save to Supabase automatically
- Webhook still works (if configured)
- localStorage still used (offline support)
- All existing features work + new database storage

⚠️ **RLS (Row Level Security):**
- Anyone can insert appeals (public)
- Admin updates blocked by default (use service role from backend)
- Details in SUPABASE_SETUP.md

---

## Files to Know

| File | Purpose |
|------|---------|
| [SQL_SETUP.sql](SQL_SETUP.sql) | SQL to create table (run this first!) |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Complete setup guide |
| [src/integrations/supabase/appeals.ts](src/integrations/supabase/appeals.ts) | All database functions |
| [src/components/appeal/AppealForm.tsx](src/components/appeal/AppealForm.tsx) | Form that saves to Supabase |

---

## Troubleshooting

**Appeal not saving?**
1. Check browser console for errors
2. Verify SQL was executed in Supabase
3. Check that table exists: Table Editor → ban_appeals

**Can't see table in Supabase?**
1. Refresh the page
2. Check you're in the right project
3. Go to SQL Editor and run: `SELECT * FROM ban_appeals LIMIT 1;`

**Getting permission errors?**
1. Run the SQL migration again
2. Make sure RLS policies are created
3. Check that public schema is correct

---

## Next Steps

1. ✅ Run SQL_SETUP.sql in Supabase
2. ✅ Test by submitting an appeal
3. ✅ View appeals in Supabase dashboard
4. 📊 (Optional) Build admin dashboard
5. 📧 (Optional) Add email notifications

---

**Questions?** Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed docs.
