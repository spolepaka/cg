import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function ChatPage() {
  const supabase = createServerSupabaseClient();
  
  // Get first channel
  const { data: firstChannel } = await supabase
    .from('channels')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (firstChannel) {
    redirect(`/chat/${firstChannel.id}`);
  }

  redirect('/chat/general'); // Fallback
}