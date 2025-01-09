import { createClient } from '@supabase/supabase-js';
import { Message } from '@/app/(chat)/types/chat';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getMessages(channelId: string): Promise<Message[]> {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('channelId', channelId)
    .order('createdAt', { ascending: true });
    
  return data || [];
} 