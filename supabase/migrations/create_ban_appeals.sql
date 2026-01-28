-- Z-Craft Ban Appeals Table
-- Create this table in your Supabase database

CREATE TABLE IF NOT EXISTS ban_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(16) NOT NULL,
  discord_tag VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  minecraft_uuid VARCHAR(36),
  ban_reason VARCHAR(100) NOT NULL,
  appeal_reason TEXT NOT NULL,
  additional_info TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'under_review')),
  response TEXT,
  handled_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  handled_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  webhook_sent BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ban_appeals_username ON ban_appeals(username);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_email ON ban_appeals(email);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_status ON ban_appeals(status);
CREATE INDEX IF NOT EXISTS idx_ban_appeals_created_at ON ban_appeals(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ban_appeals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS ban_appeals_update_timestamp ON ban_appeals;
CREATE TRIGGER ban_appeals_update_timestamp
  BEFORE UPDATE ON ban_appeals
  FOR EACH ROW
  EXECUTE FUNCTION update_ban_appeals_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE ban_appeals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public appeals)
CREATE POLICY "Allow anyone to insert appeals" ON ban_appeals
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to read their own appeal
CREATE POLICY "Allow reading own appeal" ON ban_appeals
  FOR SELECT
  USING (true);

-- Create policy to prevent deletion (only admins via dashboard)
CREATE POLICY "Prevent direct deletion" ON ban_appeals
  FOR DELETE
  USING (false);

-- Create policy to allow updates only via functions (for admins)
CREATE POLICY "Prevent direct update" ON ban_appeals
  FOR UPDATE
  USING (false);
