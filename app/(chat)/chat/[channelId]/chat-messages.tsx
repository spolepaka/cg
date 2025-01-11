'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { Message } from "@/app/(chat)/types/chat";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase/client";

interface ChatMessagesProps {
  initialMessages: Message[];
  channelId: string;
}

interface MessageGroup {
  date: Date;
  messages: Message[];
}

export function ChatMessages({ initialMessages, channelId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload: { new: { id: string } }) => {
          const { data: newMessage } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages(current => [...current, newMessage as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  const formatDateHeading = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM do');
    }
  };

  // Group messages by date with safety check
  const groupedMessages = messages.reduce((groups: MessageGroup[], message) => {
    const date = new Date(message.created_at || Date.now());
    if (isNaN(date.getTime())) {
      console.warn('Invalid date encountered:', message.created_at);
      return groups;
    }

    const dateString = format(date, 'yyyy-MM-dd');
    
    const existingGroup = groups.find(group => 
      format(group.date, 'yyyy-MM-dd') === dateString
    );
    
    if (existingGroup) {
      existingGroup.messages.push(message);
      // Sort messages within the group by created_at
      existingGroup.messages.sort((a, b) => 
        new Date(a.created_at || Date.now()).getTime() - new Date(b.created_at || Date.now()).getTime()
      );
    } else {
      groups.push({
        date: date,
        messages: [message]
      });
    }
    
    // Sort groups by date, oldest first
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-[1200px] mx-auto pb-8">
        {groupedMessages.map((group) => (
          <div key={format(group.date, 'yyyy-MM-dd')} className="mb-6">
            {/* Date Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground font-medium uppercase">
                  {formatDateHeading(group.date)}
                </span>
              </div>
            </div>

            {/* Messages with safety checks */}
            <div className="space-y-0.5">
              {group.messages.map((message, index) => {
                const prevMessage = group.messages[index - 1];
                const showHeader = !prevMessage || 
                  prevMessage.sender_id !== message.sender_id ||
                  differenceInMinutes(
                    new Date(message.created_at || Date.now()),
                    new Date(prevMessage.created_at || Date.now())
                  ) > 5;

                return (
                  <div 
                    key={message.id} 
                    className={`group px-4 py-0.5 hover:bg-accent/5 flex items-start gap-x-3 
                      ${showHeader ? 'mt-3' : 'mt-0 pl-16'}
                      animate-in fade-in-0 slide-in-from-bottom-1 duration-200`}
                  >
                    {showHeader && (
                      <Avatar className="h-9 w-9 mt-1 shrink-0">
                        <AvatarImage src={message.sender?.avatar_url} />
                        <AvatarFallback className="font-medium">
                          {message.sender?.first_name?.[0] || ''}
                          {message.sender?.last_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 overflow-hidden min-w-0">
                      {showHeader && (
                        <div className="flex items-baseline gap-x-2">
                          <span className="font-bold text-sm hover:underline cursor-pointer">
                            {message.sender?.first_name || 'Unknown'} {message.sender?.last_name || 'User'}
                          </span>
                          <span className="text-xs text-muted-foreground/75">
                            {format(new Date(message.created_at || Date.now()), 'h:mm a')}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-normal break-words text-foreground/90 dark:text-foreground/80 font-normal">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
} 