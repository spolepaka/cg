import type { Database } from '@/lib/supabase/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Profile;
};
export type Channel = Database['public']['Tables']['channels']['Row'];
export type ChannelMember = Database['public']['Tables']['channel_members']['Row']; 