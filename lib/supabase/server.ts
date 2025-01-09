import { createClient } from '@supabase/supabase-js';
import { Message } from '@/app/(chat)/types/chat';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function getMessages(channelId: string): Promise<Message[]> {
  const { data } = await supabaseServer
    .from('messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true });
    
  return data || [];
} 