-- ============================================================
-- COPY THIS ENTIRE FILE AND PASTE INTO SUPABASE SQL EDITOR
-- ============================================================
-- Steps:
-- 1. Go to https://app.supabase.com → Your Project
-- 2. Click: SQL Editor → New Query
-- 3. Delete the default comment
-- 4. Paste this entire file (Ctrl+A, Ctrl+V from raw file)
-- 5. Click: "Run"
-- 6. Wait for success message
-- Done! ✅
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ban_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(16) NOT NULL,
  discord_tag VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  minecraft_uuid VARCHAR(36),
  ban_reason VARCHAR(100) NOT NULL,
  appeal_reason TEXT NOT NULL,
  additional_info TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'under_review')),
  response TEXT,
  handled_by UUID,
  ip_address INET,
  user_agent TEXT,
  webhook_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  handled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_ban_appeals_username ON public.ban_appeals(username);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_email ON public.ban_appeals(email);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_status ON public.ban_appeals(status);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_created_at ON public.ban_appeals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_handled_at ON public.ban_appeals(handled_at DESC);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_status_created ON public.ban_appeals(status, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_ban_appeals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ban_appeals_update_timestamp ON public.ban_appeals;

CREATE TRIGGER ban_appeals_update_timestamp
  BEFORE UPDATE ON public.ban_appeals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ban_appeals_updated_at();

ALTER TABLE public.ban_appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to insert appeals" ON public.ban_appeals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow reading appeals" ON public.ban_appeals
  FOR SELECT USING (true);

CREATE POLICY "Prevent direct deletion" ON public.ban_appeals
  FOR DELETE USING (false);

CREATE POLICY "Prevent direct client update" ON public.ban_appeals
  FOR UPDATE USING (false);

CREATE OR REPLACE VIEW public.v_pending_appeals AS
SELECT * FROM public.ban_appeals
WHERE status = 'pending'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW public.v_appeal_stats AS
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_count
FROM public.ban_appeals
GROUP BY status
ORDER BY count DESC;
