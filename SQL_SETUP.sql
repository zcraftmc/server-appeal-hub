-- ============================================================
-- Z-Craft Ban Appeals Table
-- ============================================================
-- Execute this SQL in your Supabase SQL Editor
-- Database: PostgreSQL 14.1+
-- ============================================================

-- Create the main ban_appeals table
CREATE TABLE IF NOT EXISTS public.ban_appeals (
  -- Identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Information
  username VARCHAR(16) NOT NULL COMMENT 'Minecraft username (case-sensitive)',
  discord_tag VARCHAR(100) NOT NULL COMMENT 'Discord username or tag',
  email VARCHAR(255) NOT NULL COMMENT 'Contact email address',
  minecraft_uuid VARCHAR(36) COMMENT 'Optional: Minecraft UUID for verification',
  
  -- Appeal Information
  ban_reason VARCHAR(100) NOT NULL COMMENT 'Reason player was banned',
  appeal_reason TEXT NOT NULL COMMENT 'Player''s explanation/appeal',
  additional_info TEXT COMMENT 'Optional additional information from player',
  
  -- Status & Response
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'denied', 'under_review'))
    COMMENT 'Appeal status: pending, under_review, approved, or denied',
  response TEXT COMMENT 'Staff response when appeal is handled',
  
  -- Admin Tracking
  handled_by UUID COMMENT 'UUID of admin who handled the appeal',
  handled_at TIMESTAMP WITH TIME ZONE COMMENT 'When the appeal was handled',
  
  -- Metadata
  ip_address INET COMMENT 'Optional: IP address of submitter',
  user_agent TEXT COMMENT 'Browser user agent string',
  webhook_sent BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether webhook notification was sent',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ban_appeals_username 
  ON public.ban_appeals(username);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_email 
  ON public.ban_appeals(email);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_status 
  ON public.ban_appeals(status);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_created_at 
  ON public.ban_appeals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_handled_at 
  ON public.ban_appeals(handled_at DESC);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_status_created 
  ON public.ban_appeals(status, created_at DESC);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_ban_appeals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if present
DROP TRIGGER IF EXISTS ban_appeals_update_timestamp ON public.ban_appeals;

-- Create trigger to update timestamp on any update
CREATE TRIGGER ban_appeals_update_timestamp
  BEFORE UPDATE ON public.ban_appeals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ban_appeals_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on the table
ALTER TABLE public.ban_appeals ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to submit/insert appeals
CREATE POLICY "Allow anyone to insert appeals"
  ON public.ban_appeals
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow anyone to read appeals (can be restricted)
CREATE POLICY "Allow reading appeals"
  ON public.ban_appeals
  FOR SELECT
  USING (true);

-- Policy 3: Prevent direct deletion
CREATE POLICY "Prevent direct deletion"
  ON public.ban_appeals
  FOR DELETE
  USING (false);

-- Policy 4: Prevent direct update via client
-- (Admin updates should use service role from backend)
CREATE POLICY "Prevent direct client update"
  ON public.ban_appeals
  FOR UPDATE
  USING (false);

-- ============================================================
-- Views (Optional - for easier querying)
-- ============================================================

-- View for pending appeals
CREATE OR REPLACE VIEW public.v_pending_appeals AS
SELECT * FROM public.ban_appeals
WHERE status = 'pending'
ORDER BY created_at DESC;

-- View for appeal statistics
CREATE OR REPLACE VIEW public.v_appeal_stats AS
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_count
FROM public.ban_appeals
GROUP BY status
ORDER BY count DESC;

-- ============================================================
-- Sample Queries
-- ============================================================

-- Get all appeals
-- SELECT * FROM public.ban_appeals ORDER BY created_at DESC;

-- Get pending appeals
-- SELECT * FROM public.ban_appeals WHERE status = 'pending' ORDER BY created_at DESC;

-- Get appeals by username
-- SELECT * FROM public.ban_appeals WHERE username = 'PlayerName';

-- Get appeals by email
-- SELECT * FROM public.ban_appeals WHERE email = 'player@example.com';

-- Get today's appeals
-- SELECT * FROM public.ban_appeals WHERE DATE(created_at) = CURRENT_DATE;

-- Get statistics
-- SELECT * FROM public.v_appeal_stats;

-- Get recent appeals (last 7 days)
-- SELECT * FROM public.ban_appeals 
-- WHERE created_at >= NOW() - INTERVAL '7 days'
-- ORDER BY created_at DESC;

-- ============================================================
-- Maintenance Queries
-- ============================================================

-- Check table size
-- SELECT pg_size_pretty(pg_total_relation_size('public.ban_appeals'));

-- Get record count
-- SELECT COUNT(*) FROM public.ban_appeals;

-- Get appeal breakdown by status
-- SELECT status, COUNT(*) FROM public.ban_appeals GROUP BY status;

-- ============================================================
-- End of SQL
-- ============================================================
