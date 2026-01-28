# Supabase Appeal Integration Setup Guide

## Overview
Appeals are now saved to Supabase database in real-time. They are stored in the `ban_appeals` table with comprehensive metadata tracking.

## Database Setup

### Step 1: Create the Table in Supabase

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire SQL from `supabase/migrations/create_ban_appeals.sql`
5. Execute the query

This will create:
- ✅ `ban_appeals` table with all required columns
- ✅ Automatic `updated_at` timestamp trigger
- ✅ Performance indexes on frequently queried columns
- ✅ Row Level Security (RLS) policies

### Step 2: Verify Table Creation

Run this query in SQL Editor to verify:
```sql
SELECT * FROM ban_appeals LIMIT 1;
```

You should see the table structure with columns like:
- id, username, discord_tag, email, ban_reason, appeal_reason, status, etc.

## Application Integration

### Files Modified
1. ✅ `src/integrations/supabase/appeals.ts` - New Supabase service functions
2. ✅ `src/components/appeal/AppealForm.tsx` - Updated to save to Supabase
3. ✅ `supabase/migrations/create_ban_appeals.sql` - SQL table definition

### How It Works Now

When a user submits an appeal:

1. **Local Storage** - Appeal is saved to localStorage (for offline access)
2. **Supabase Database** - Appeal is saved to `ban_appeals` table
3. **Webhook** (if configured) - Discord notification is sent
4. **Webhook Tracking** - Supabase records if webhook was sent

## Database Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique appeal identifier |
| `username` | VARCHAR(16) | Minecraft username |
| `discord_tag` | VARCHAR(100) | Discord username/tag |
| `email` | VARCHAR(255) | Email address |
| `minecraft_uuid` | VARCHAR(36) | Optional: Minecraft UUID |
| `ban_reason` | VARCHAR(100) | Reason for ban |
| `appeal_reason` | TEXT | Full appeal explanation |
| `additional_info` | TEXT | Optional additional notes |
| `status` | VARCHAR(20) | pending/approved/denied/under_review |
| `response` | TEXT | Admin response (set when handled) |
| `handled_by` | UUID | User ID of admin who handled it |
| `created_at` | TIMESTAMP | When appeal was submitted |
| `updated_at` | TIMESTAMP | Last update timestamp (auto) |
| `handled_at` | TIMESTAMP | When admin responded |
| `ip_address` | INET | Optional: IP address metadata |
| `user_agent` | TEXT | Browser user agent info |
| `webhook_sent` | BOOLEAN | Whether webhook notification was sent |

## Available Functions

### Save Appeal
```typescript
import { saveAppealToSupabase } from "@/integrations/supabase/appeals";

const appeal = await saveAppealToSupabase({
  username: "PlayerName",
  discord_tag: "DiscordTag#1234",
  email: "player@example.com",
  ban_reason: "Hacking",
  appeal_reason: "I didn't hack...",
  additional_info: "Optional info"
});
```

### Get Appeals
```typescript
import { getAllAppeals, getAppealById, getAppealByUsername } from "@/integrations/supabase/appeals";

// Get all appeals
const appeals = await getAllAppeals();

// Get by ID
const appeal = await getAppealById("appeal-id-uuid");

// Get by username
const playerAppeals = await getAppealByUsername("PlayerName");

// Get by email
const emailAppeals = await getAppealByEmail("player@example.com");

// Get by status
const pending = await getAppealsByStatus("pending");

// Get recent appeals (last 7 days)
const recent = await getRecentAppeals(7);
```

### Update Appeal Status (Admin)
```typescript
import { updateAppealStatus } from "@/integrations/supabase/appeals";

// Mark as approved with response
await updateAppealStatus(
  "appeal-id-uuid",
  "approved",
  "Your appeal has been accepted. You are unbanned!",
  "admin-user-id" // Optional: admin who handled it
);
```

### Get Statistics
```typescript
import { getAppealStats } from "@/integrations/supabase/appeals";

const stats = await getAppealStats();
// Returns: { total: 25, pending: 10, approved: 10, denied: 5 }
```

## Row Level Security (RLS)

The table has RLS enabled with these policies:

### Public Insert
- Anyone can submit an appeal
- No authentication required

### Public Read
- Anyone can read any appeal (can be restricted if needed)

### Admin Updates
- Updates/deletes are blocked by default
- Admin functions should use service role key (from admin dashboard)

## Monitoring Appeals

### In Supabase Dashboard
1. Go to **Table Editor**
2. Click on `ban_appeals`
3. View all submitted appeals in real-time
4. Filter by status: pending, approved, denied, under_review

### Using Supabase Queries
```sql
-- Get pending appeals
SELECT * FROM ban_appeals WHERE status = 'pending' ORDER BY created_at DESC;

-- Get appeals by username
SELECT * FROM ban_appeals WHERE username = 'PlayerName';

-- Get today's appeals
SELECT * FROM ban_appeals WHERE DATE(created_at) = CURRENT_DATE;

-- Get statistics
SELECT 
  status,
  COUNT(*) as count
FROM ban_appeals
GROUP BY status;

-- Get appeals that haven't been handled yet
SELECT * FROM ban_appeals WHERE status = 'pending' AND handled_at IS NULL;
```

## Webhook Integration

Webhooks are still supported. When an appeal is submitted:
1. Appeal is saved to Supabase
2. Webhook is sent to Discord (if `VITE_APPEAL_WEBHOOK_URL` is set)
3. Supabase records `webhook_sent = true` if successful

## Accessing Supabase Admin Functions

For backend operations (handling appeals), you'll need the **service role key**:

1. Go to Supabase dashboard
2. Settings → API
3. Copy the **Service role** (secret) key
4. Use it in backend code:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Now you can use admin functions
await supabaseAdmin
  .from('ban_appeals')
  .update({ status: 'approved' })
  .eq('id', 'appeal-id');
```

## Testing

To test the integration:

1. Open the appeal form
2. Submit a test appeal
3. Check the Supabase dashboard → Table Editor → `ban_appeals`
4. You should see the new appeal appear in real-time

Expected data:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "TestPlayer",
  "discord_tag": "TestUser#1234",
  "email": "test@example.com",
  "ban_reason": "Hacking",
  "appeal_reason": "I was framed...",
  "status": "pending",
  "created_at": "2026-01-28T10:30:00.000Z",
  "updated_at": "2026-01-28T10:30:00.000Z",
  "webhook_sent": true
}
```

## Troubleshooting

### Appeal not appearing in Supabase?
- Check browser console for errors
- Verify Supabase credentials in `src/integrations/supabase/client.ts`
- Check network tab to see if request succeeded
- Verify RLS policies allow inserts

### Webhook not sending?
- Set `VITE_APPEAL_WEBHOOK_URL` in `.env`
- Webhook must be valid Discord webhook URL
- Check browser console for error messages

### Permission denied error?
- Make sure RLS policy allows public inserts
- Run the SQL migration again
- Verify table exists in Supabase

## Environment Variables

No additional env vars needed! The Supabase credentials are already in:
- `src/integrations/supabase/client.ts`

Optional:
- `VITE_APPEAL_WEBHOOK_URL` - Discord webhook URL (already supported)

## Next Steps

1. ✅ Create table in Supabase using provided SQL
2. ✅ Test submission from the form
3. ✅ View appeals in Supabase dashboard
4. ✅ Create admin dashboard to view/respond to appeals
5. ✅ Set up email notifications (optional)

## Backup & Migration

To backup your appeals:

```sql
-- Export as CSV
SELECT * FROM ban_appeals ORDER BY created_at DESC;
```

Then use Supabase's export feature or backup tools.
