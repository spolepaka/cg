import { Suspense } from 'react';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getMessages } from '@/lib/supabase/db';
import { Hash, ChevronDown, Users, Star, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChannelDropdown } from './channel-dropdown';
import type { Channel } from '@/app/(chat)/types/chat';

interface PageProps {
  params: {
    channelId: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient();
  const messages = await getMessages(params.channelId);
  
  // Fetch current channel and all channels
  const [{ data: channel }, { data: channels }] = await Promise.all([
    supabase.from('channels').select('*').eq('id', params.channelId).single(),
    supabase.from('channels').select('*').order('name')
  ]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Channel Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background">
        <div className="flex items-center gap-x-2">
          <ChannelDropdown 
            currentChannel={channel} 
            channels={channels as Channel[] || []}
          >
            <Button variant="ghost" className="hover:bg-accent/50 px-2 py-1 h-auto font-semibold">
              <Hash className="w-4 h-4 text-muted-foreground mr-1" />
              {channel?.name || 'unknown'}
              <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
            </Button>
          </ChannelDropdown>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <div className="flex items-center gap-x-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Star className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Pin className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs font-medium">
            <Users className="w-3 h-3 mr-1" />
            205
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading messages...</div>
        </div>
      }>
        <ChatMessages 
          initialMessages={messages}
          channelId={params.channelId}
        />
      </Suspense>

      {/* Input Area */}
      <ChatInput channelId={params.channelId} />
    </div>
  );
}