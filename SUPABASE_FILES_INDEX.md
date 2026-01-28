# Supabase Integration Files - Index

## Start Here 👇

### For Immediate Setup (Copy & Paste)
📄 **[COPY_PASTE_SQL.sql](COPY_PASTE_SQL.sql)** - Ready to paste SQL  
⏱️ Time: 1 minute  
👉 This is what you run in Supabase SQL Editor

### For Quick Understanding
📄 **[README_SUPABASE.md](README_SUPABASE.md)** - Overview & quick start  
⏱️ Time: 5 minutes  
👉 Read this first to understand what's happening

### For Detailed Setup
📄 **[SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md)** - Quick reference  
⏱️ Time: 5 minutes  
👉 Common commands and examples

---

## Reference Docs

### Complete Guides
📚 **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete setup guide  
⏱️ Time: 15 minutes  
📖 Every detail about setup and configuration

📚 **[SUPABASE_INTEGRATION_SUMMARY.md](SUPABASE_INTEGRATION_SUMMARY.md)** - Full summary  
⏱️ Time: 10 minutes  
📖 Everything that was implemented

### SQL Documentation
📄 **[SQL_SETUP.sql](SQL_SETUP.sql)** - Annotated SQL  
⏱️ Time: 10 minutes  
📖 SQL with detailed comments explaining each part

---

## Code Files

### TypeScript Integration
💻 **[src/integrations/supabase/appeals.ts](src/integrations/supabase/appeals.ts)** - Database functions  
✅ 15+ functions for all database operations  
✅ Ready to use in your app  
✅ Full TypeScript support

### Updated Form
💻 **[src/components/appeal/AppealForm.tsx](src/components/appeal/AppealForm.tsx)** - Form integration  
✅ Already saves to Supabase  
✅ No changes needed  
✅ Works with existing code

### Database Configuration
⚙️ **[src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)** - Supabase client  
✅ Already configured  
✅ No changes needed  
✅ Ready to use

---

## Timeline

### ⚡ Super Quick (1 minute)
1. Open [COPY_PASTE_SQL.sql](COPY_PASTE_SQL.sql)
2. Copy all text
3. Paste into Supabase SQL Editor
4. Click Run
5. Done! ✅

### ⏱️ Quick Setup (5 minutes)
1. Read [README_SUPABASE.md](README_SUPABASE.md)
2. Copy SQL from [COPY_PASTE_SQL.sql](COPY_PASTE_SQL.sql)
3. Run in Supabase
4. Test by submitting appeal
5. View in Supabase dashboard

### 📚 Complete Understanding (20 minutes)
1. Read [README_SUPABASE.md](README_SUPABASE.md)
2. Read [SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md)
3. Copy & run SQL
4. Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
5. Review [src/integrations/supabase/appeals.ts](src/integrations/supabase/appeals.ts)

---

## What Each File Does

### Setup Files
| File | What | Why |
|------|------|-----|
| COPY_PASTE_SQL.sql | Ready-to-run SQL | Fastest setup |
| SQL_SETUP.sql | Detailed SQL | Reference/learning |
| supabase/migrations/create_ban_appeals.sql | Migration file | Documentation |

### Documentation Files
| File | Purpose | Read Time |
|------|---------|-----------|
| README_SUPABASE.md | Overview & quick start | 5 min |
| SUPABASE_QUICK_REFERENCE.md | Quick lookup guide | 5 min |
| SUPABASE_SETUP.md | Complete guide | 15 min |
| SUPABASE_INTEGRATION_SUMMARY.md | Full summary | 10 min |

### Code Files
| File | Contains | Status |
|------|----------|--------|
| src/integrations/supabase/appeals.ts | Database functions (NEW) | Ready |
| src/components/appeal/AppealForm.tsx | Form integration (UPDATED) | Ready |
| src/integrations/supabase/client.ts | Supabase client (EXISTING) | Ready |

---

## Database Schema Quick View

```
ban_appeals table (17 columns)
├── id (UUID)                     ← Unique ID
├── username (VARCHAR)            ← Minecraft username
├── discord_tag (VARCHAR)         ← Discord tag
├── email (VARCHAR)               ← Email
├── ban_reason (VARCHAR)          ← Ban reason
├── appeal_reason (TEXT)          ← Appeal text
├── additional_info (TEXT)        ← Optional notes
├── status (VARCHAR)              ← pending/approved/denied
├── response (TEXT)               ← Staff response
├── handled_by (UUID)             ← Admin ID
├── handled_at (TIMESTAMP)        ← When handled
├── created_at (TIMESTAMP)        ← Created auto
├── updated_at (TIMESTAMP)        ← Updated auto
├── webhook_sent (BOOLEAN)        ← Webhook sent?
├── ip_address (INET)             ← IP info
└── user_agent (TEXT)             ← Browser info
```

---

## Available Functions

### Query Functions
```
getAllAppeals()              ← Get all
getAppealById(id)            ← Get by ID
getAppealByUsername(name)    ← Get by username
getAppealByEmail(email)      ← Get by email
getAppealsByStatus(status)   ← Get by status
getRecentAppeals(days)       ← Last N days
getAppealStats()             ← Statistics
```

### Save Functions
```
saveAppealToSupabase(data)   ← Save new appeal
```

### Admin Functions
```
updateAppealStatus(...)      ← Update status
markWebhookSent(id)          ← Mark webhook sent
deleteAppeal(id)             ← Delete appeal
```

---

## Quick Commands

### Copy SQL (fastest way)
```bash
# 1. Open COPY_PASTE_SQL.sql
# 2. Select All (Ctrl+A)
# 3. Copy (Ctrl+C)
# 4. Go to Supabase SQL Editor
# 5. Paste (Ctrl+V)
# 6. Run
```

### Check Table Exists
```sql
SELECT * FROM ban_appeals LIMIT 1;
```

### Get All Appeals
```sql
SELECT * FROM ban_appeals ORDER BY created_at DESC;
```

### Get Pending
```sql
SELECT * FROM ban_appeals WHERE status = 'pending';
```

---

## Verification Checklist

- [ ] Opened COPY_PASTE_SQL.sql
- [ ] Copied all SQL text
- [ ] Opened Supabase SQL Editor
- [ ] Pasted SQL
- [ ] Clicked Run
- [ ] No errors shown
- [ ] Table Editor shows ban_appeals
- [ ] Submitted test appeal
- [ ] Appeal appears in table
- [ ] All 17 columns visible

---

## Next Steps

### Option A: Just Get It Working
1. Copy [COPY_PASTE_SQL.sql](COPY_PASTE_SQL.sql)
2. Paste in Supabase
3. Test
4. Done! ✅

### Option B: Understand It
1. Read [README_SUPABASE.md](README_SUPABASE.md)
2. Copy SQL
3. Run in Supabase
4. Read [SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md)
5. Review functions in appeals.ts

### Option C: Full Deep Dive
1. Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. Review [SQL_SETUP.sql](SQL_SETUP.sql)
3. Copy & run SQL
4. Study [src/integrations/supabase/appeals.ts](src/integrations/supabase/appeals.ts)
5. Build admin dashboard

---

## File Sizes

| File | Size | Format |
|------|------|--------|
| COPY_PASTE_SQL.sql | 4 KB | SQL |
| SQL_SETUP.sql | 8 KB | SQL |
| appeals.ts | 10 KB | TypeScript |
| README_SUPABASE.md | 8 KB | Markdown |
| SUPABASE_SETUP.md | 12 KB | Markdown |
| SUPABASE_QUICK_REFERENCE.md | 6 KB | Markdown |

---

## Support

### If Something Goes Wrong
1. Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) → Troubleshooting
2. Check [SUPABASE_QUICK_REFERENCE.md](SUPABASE_QUICK_REFERENCE.md) → Troubleshooting
3. Check browser console for errors
4. Verify Supabase credentials

### For More Info
- Supabase Docs: https://supabase.com/docs
- Supabase Dashboard: https://app.supabase.com

---

## Summary

**Everything you need is here.** Pick your path:

🚀 **Fastest** → [COPY_PASTE_SQL.sql](COPY_PASTE_SQL.sql) (1 min)  
📖 **Quick** → [README_SUPABASE.md](README_SUPABASE.md) (5 min)  
📚 **Complete** → [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (15 min)

**That's it!** Appeals now save to Supabase automatically. 🎉
