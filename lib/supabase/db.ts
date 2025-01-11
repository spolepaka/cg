import { createServerSupabaseClient } from './server';
import type { Database } from './database.types';

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Database['public']['Tables']['profiles']['Row']
};

export async function getMessages(channelId: string): Promise<Message[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });
    
  return data || [];
} 