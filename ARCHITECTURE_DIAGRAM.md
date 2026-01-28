# Architecture Diagram - Supabase Integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐                                      │
│  │   Appeal Form    │                                      │
│  │ (AppealForm.tsx) │                                      │
│  └────────┬─────────┘                                      │
│           │                                                │
│           ├─────────┬─────────┬──────────────┐             │
│           ▼         ▼         ▼              ▼             │
│      ┌────────┐ ┌───────┐ ┌──────────┐ ┌─────────────┐    │
│      │  Form  │ │Local  │ │Supabase  │ │  Webhook    │    │
│      │Validate│ │Storage│ │  Save    │ │   Send      │    │
│      └────────┘ └───────┘ └──────────┘ └─────────────┘    │
│                    ▲           ▲              ▲             │
└────────────────────┼───────────┼──────────────┼─────────────┘
                     │           │              │
                     │           ▼              │
                     │     ┌──────────────┐    │
                     │     │  Supabase    │    │
                     │     │  PostgreSQL  │    │
                     │     │  Database    │    │
                     │     └──────────────┘    │
                     │           ▲             │
                     │           │             │
                     └───────────┴─────────────┴─→ Discord Webhook
```

---

## Data Flow

### Appeal Submission

```
User fills form
       ↓
Validate data (Zod)
       ↓
┌──────────────────────────────────────────┐
│    onSubmit() triggered                  │
├──────────────────────────────────────────┤
│ 1. Save to localStorage                  │
│    └─ Instant (synchronous)              │
│                                          │
│ 2. Save to Supabase                      │
│    └─ Async (non-blocking)               │
│    └─ Returns appeal with ID             │
│                                          │
│ 3. Send Webhook                          │
│    └─ Async (non-blocking)               │
│    └─ Only if URL configured             │
│                                          │
│ 4. Mark Webhook Sent                     │
│    └─ Update webhook_sent flag           │
│                                          │
│ 5. Show Success Message                  │
│    └─ Display confirmation               │
└──────────────────────────────────────────┘
       ↓
Appeal saved to:
├─ localStorage (browser)
├─ Supabase DB (PostgreSQL)
└─ Discord (via webhook)
```

---

## Component Integration

```
AppealForm.tsx
│
├─ Import: saveAppealToSupabase
├─ Import: markWebhookSent
├─ Import: submitToWebhook (existing)
│
└─ onSubmit()
   │
   ├─ Step 1: saveAppeal() to localStorage
   │
   ├─ Step 2: await saveAppealToSupabase(data)
   │          │
   │          └─ POST to Supabase
   │             └─ Returns: BanAppealDB
   │
   ├─ Step 3: await submitToWebhook(savedAppeal)
   │          │
   │          └─ POST to Discord webhook
   │             └─ Returns: boolean
   │
   ├─ Step 4: await markWebhookSent(supabaseAppeal.id)
   │          │
   │          └─ UPDATE Supabase
   │             └─ Set webhook_sent = true
   │
   └─ Step 5: Show success toast
```

---

## Database Schema

```
ban_appeals (PostgreSQL table)
│
├─ IDENTIFIERS
│  ├─ id: UUID (Primary Key, auto)
│  ├─ username: VARCHAR(16)
│  ├─ discord_tag: VARCHAR(100)
│  └─ email: VARCHAR(255)
│
├─ BAN INFO
│  ├─ ban_reason: VARCHAR(100)
│  └─ minecraft_uuid: VARCHAR(36) [optional]
│
├─ APPEAL INFO
│  ├─ appeal_reason: TEXT
│  └─ additional_info: TEXT [optional]
│
├─ STATUS & RESPONSE
│  ├─ status: VARCHAR(20)
│  │  └─ CHECK: pending|approved|denied|under_review
│  └─ response: TEXT [optional]
│
├─ ADMIN TRACKING
│  ├─ handled_by: UUID [optional]
│  └─ handled_at: TIMESTAMP [optional]
│
├─ METADATA
│  ├─ ip_address: INET [optional]
│  ├─ user_agent: TEXT
│  └─ webhook_sent: BOOLEAN
│
└─ TIMESTAMPS
   ├─ created_at: TIMESTAMP (auto)
   └─ updated_at: TIMESTAMP (auto, with trigger)
```

---

## Request Flow

### Insert New Appeal

```
Browser
   │
   ├─ POST /api/rest/v1/ban_appeals
   │  Headers:
   │  - Authorization: Bearer ANON_KEY
   │  - Content-Type: application/json
   │
   │  Body:
   │  {
   │    username: string,
   │    discord_tag: string,
   │    email: string,
   │    ban_reason: string,
   │    appeal_reason: string,
   │    additional_info?: string,
   │    user_agent: string,
   │    webhook_sent: false
   │  }
   │
   ▼
Supabase
   │
   ├─ Check RLS policy (allow insert)
   ├─ Generate UUID for id
   ├─ Set created_at to NOW()
   ├─ Set updated_at to NOW()
   └─ INSERT into ban_appeals
   
   ▼
Response:
{
  id: UUID,
  username: string,
  ... (all fields)
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## Database Indexes

```
ban_appeals table
│
├─ PRIMARY KEY
│  └─ id (UUID)
│
├─ INDEXES
│  ├─ idx_ban_appeals_username
│  │  └─ Optimize: WHERE username = ?
│  │
│  ├─ idx_ban_appeals_email
│  │  └─ Optimize: WHERE email = ?
│  │
│  ├─ idx_ban_appeals_status
│  │  └─ Optimize: WHERE status = ?
│  │
│  ├─ idx_ban_appeals_created_at (DESC)
│  │  └─ Optimize: ORDER BY created_at DESC
│  │
│  ├─ idx_ban_appeals_handled_at (DESC)
│  │  └─ Optimize: ORDER BY handled_at DESC
│  │
│  └─ idx_ban_appeals_status_created
│     └─ Optimize: WHERE status = ? ORDER BY created_at DESC
│
└─ TRIGGERS
   └─ ban_appeals_update_timestamp
      └─ Auto-update updated_at on modification
```

---

## Security Layer

```
Request from Browser
   │
   ├─ Supabase Receives Request
   │
   ├─ 1. Check Authentication
   │     (Public: No auth required for INSERT)
   │
   ├─ 2. Check RLS Policies
   │     ├─ INSERT: "Allow anyone to insert appeals" ✓ PASS
   │     ├─ SELECT: "Allow reading appeals" ✓ PASS
   │     ├─ UPDATE: "Prevent direct client update" ✗ FAIL
   │     └─ DELETE: "Prevent direct deletion" ✗ FAIL
   │
   ├─ 3. Validate Data
   │     ├─ Constraints
   │     ├─ Types
   │     └─ Lengths
   │
   └─ 4. Execute Query
      └─ If all checks pass → Insert
         If any check fails → Reject with error
```

---

## Function Call Chain

```
AppealForm.tsx
│
├─ saveAppealToSupabase(data)
│  │
│  ├─ client.ts
│  │  └─ supabase.from('ban_appeals').insert([...])
│  │
│  └─ Returns: BanAppealDB | null
│
├─ submitToWebhook(savedAppeal)
│  │
│  ├─ Check VITE_APPEAL_WEBHOOK_URL
│  ├─ fetch(webhookUrl, { POST, JSON })
│  │
│  └─ Returns: boolean
│
└─ markWebhookSent(supabaseAppeal.id)
   │
   ├─ client.ts
   │  └─ supabase.from('ban_appeals')
   │     .update({ webhook_sent: true })
   │     .eq('id', id)
   │
   └─ Returns: boolean
```

---

## Database Views

```
v_pending_appeals (VIEW)
│
├─ SELECT * FROM ban_appeals
├─ WHERE status = 'pending'
└─ ORDER BY created_at DESC
│
└─ Use: Quick access to pending appeals


v_appeal_stats (VIEW)
│
├─ SELECT status, COUNT(*) as count
├─ COUNT(*) FILTER ... today_count
├─ FROM ban_appeals
├─ GROUP BY status
└─ ORDER BY count DESC
│
└─ Use: Statistics and metrics
```

---

## File Dependencies

```
AppealForm.tsx
│
├─ imports: saveAppealToSupabase
│  └─ from: src/integrations/supabase/appeals.ts
│     └─ imports: supabase
│        └─ from: src/integrations/supabase/client.ts
│
├─ imports: markWebhookSent
│  └─ from: src/integrations/supabase/appeals.ts
│     └─ imports: supabase
│        └─ from: src/integrations/supabase/client.ts
│
└─ imports: submitToWebhook
   └─ from: src/lib/appeal-storage.ts
      └─ uses: import.meta.env.VITE_APPEAL_WEBHOOK_URL
```

---

## Deployment Architecture

```
Development
├─ Supabase Project (dev database)
├─ .env.local with dev credentials
└─ localhost:5173

Production
├─ Supabase Project (prod database)
├─ .env with prod credentials
├─ Built files in /dist
└─ Deployed to hosting

Both use same code:
├─ src/integrations/supabase/appeals.ts
├─ src/components/appeal/AppealForm.tsx
└─ src/integrations/supabase/client.ts

Difference is only in environment variables
```

---

## Error Handling

```
saveAppealToSupabase(data)
│
├─ Try block
│  ├─ Prepare data
│  ├─ Call Supabase
│  ├─ Check for errors
│  │  └─ If error: log and return null
│  └─ Return data or null
│
└─ Catch block
   └─ Log unexpected error and return null

Result handling in AppealForm:
├─ If success: Show success toast
├─ If failure: Show error toast
└─ User can retry
```

---

## Real-time Sync (Concept)

```
Supabase can notify in real-time:

1. Browser A submits appeal
   │
   └─ Appeal saved to database
   │
   ├─ Browser A gets response
   │
   ├─ Browser B listening (via Realtime)
   │  └─ Receives notification immediately
   │
   └─ Browser B updates UI
      └─ Shows new appeal

Implementation:
- Optional (not currently enabled)
- Can be added to admin dashboard
- Uses Supabase Realtime channels
```

---

## Summary

```
┌──────────────────────────────────────┐
│          Frontend (React)             │
│     ┌──────────────────────────┐      │
│     │    AppealForm Component   │      │
│     │  - Form validation (Zod)  │      │
│     │  - Multi-step submit      │      │
│     │  - Error handling         │      │
│     └──────────────────────────┘      │
└────────────────┬─────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
   ┌─────────┐      ┌──────────────┐
   │localStorage   │  Supabase     │
   │              │  PostgreSQL    │
   │ Instant      │  Persistent    │
   │ Offline      │  Queryable     │
   └─────────┘    └──────────────┘
```

This is the complete architecture of your Supabase integration!
