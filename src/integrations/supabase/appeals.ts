import { supabase } from "./client";

export interface BanAppealDB {
  id: string;
  username: string;
  discord_tag: string;
  email: string;
  minecraft_uuid?: string;
  ban_reason: string;
  appeal_reason: string;
  additional_info?: string;
  status: 'pending' | 'approved' | 'denied' | 'under_review';
  response?: string;
  handled_by?: string;
  created_at: string;
  updated_at: string;
  handled_at?: string;
  ip_address?: string;
  user_agent?: string;
  webhook_sent: boolean;
}

/**
 * Save an appeal to Supabase
 */
export const saveAppealToSupabase = async (appealData: {
  username: string;
  discord_tag: string;
  email: string;
  ban_reason: string;
  appeal_reason: string;
  additional_info?: string;
}): Promise<BanAppealDB | null> => {
  try {
    // Get user agent and IP (IP will be set by Supabase through metadata)
    const userAgent = navigator.userAgent;

    const { data, error } = await supabase
      .from('ban_appeals')
      .insert([
        {
          username: appealData.username,
          discord_tag: appealData.discord_tag,
          email: appealData.email,
          ban_reason: appealData.ban_reason,
          appeal_reason: appealData.appeal_reason,
          additional_info: appealData.additional_info || null,
          status: 'pending',
          user_agent: userAgent,
          webhook_sent: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving appeal to Supabase:', error);
      return null;
    }

    console.log('Appeal saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error saving appeal to Supabase:', error);
    return null;
  }
};

/**
 * Get all appeals (admin function)
 */
export const getAllAppeals = async (): Promise<BanAppealDB[]> => {
  try {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appeals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching appeals:', error);
    return [];
  }
};

/**
 * Get appeal by ID
 */
export const getAppealById = async (id: string): Promise<BanAppealDB | null> => {
  try {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appeal:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching appeal:', error);
    return null;
  }
};

/**
 * Get appeal by username
 */
export const getAppealByUsername = async (username: string): Promise<BanAppealDB[]> => {
  try {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appeals by username:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching appeals:', error);
    return [];
  }
};

/**
 * Get appeal by email
 */
export const getAppealByEmail = async (email: string): Promise<BanAppealDB[]> => {
  try {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appeals by email:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching appeals:', error);
    return [];
  }
};

/**
 * Update appeal status (admin only)
 */
export const updateAppealStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'denied' | 'under_review',
  response?: string,
  handledBy?: string
): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
      handled_at: new Date().toISOString(),
    };

    if (response) {
      updateData.response = response;
    }

    if (handledBy) {
      updateData.handled_by = handledBy;
    }

    const { error } = await supabase
      .from('ban_appeals')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating appeal status:', error);
      return false;
    }

    console.log('Appeal status updated:', id);
    return true;
  } catch (error) {
    console.error('Unexpected error updating appeal:', error);
    return false;
  }
};

/**
 * Mark appeal as webhook sent
 */
export const markWebhookSent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ban_appeals')
      .update({ webhook_sent: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking webhook as sent:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error marking webhook sent:', error);
    return false;
  }
};

/**
 * Get appeals by status
 */
export const getAppealsByStatus = async (status: string): Promise<BanAppealDB[]> => {
  try {
    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appeals by status:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching appeals:', error);
    return [];
  }
};

/**
 * Get recent appeals (last N days)
 */
export const getRecentAppeals = async (days: number = 7): Promise<BanAppealDB[]> => {
  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data, error } = await supabase
      .from('ban_appeals')
      .select('*')
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent appeals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching recent appeals:', error);
    return [];
  }
};

/**
 * Delete appeal (admin only - hard delete)
 */
export const deleteAppeal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ban_appeals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appeal:', error);
      return false;
    }

    console.log('Appeal deleted:', id);
    return true;
  } catch (error) {
    console.error('Unexpected error deleting appeal:', error);
    return false;
  }
};

/**
 * Get appeal statistics
 */
export const getAppealStats = async () => {
  try {
    const { data: total } = await supabase
      .from('ban_appeals')
      .select('*', { count: 'exact' });

    const { data: pending } = await supabase
      .from('ban_appeals')
      .select('*', { count: 'exact' })
      .eq('status', 'pending');

    const { data: approved } = await supabase
      .from('ban_appeals')
      .select('*', { count: 'exact' })
      .eq('status', 'approved');

    const { data: denied } = await supabase
      .from('ban_appeals')
      .select('*', { count: 'exact' })
      .eq('status', 'denied');

    return {
      total: total?.length || 0,
      pending: pending?.length || 0,
      approved: approved?.length || 0,
      denied: denied?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching appeal stats:', error);
    return { total: 0, pending: 0, approved: 0, denied: 0 };
  }
};
