'use client';

import { Message } from "@/app/(chat)/types/chat";

interface ChatMessagesProps {
  initialMessages: Message[];
  channelId: string;
}

export function ChatMessages({ initialMessages, channelId }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {initialMessages.map((message) => (
        <div key={message.id} className="mb-4">
          <p className="text-sm text-muted-foreground">{message.sender}</p>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
} 