import { Suspense } from 'react';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { getMessages } from '@/app/lib/supabase/server';

interface ChatPageProps {
  params: {
    channelId: string;
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const initialMessages = await getMessages(params.channelId);

  if (!params.channelId) {
    return (
      <div className="h-full flex items-center justify-center">
        <h2 className="text-lg font-medium text-muted-foreground">
          Select a channel to start chatting
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<div>Loading messages...</div>}>
        <ChatMessages 
          initialMessages={initialMessages}
          channelId={params.channelId}
        />
      </Suspense>
      <ChatInput channelId={params.channelId} />
    </div>
  );
} 