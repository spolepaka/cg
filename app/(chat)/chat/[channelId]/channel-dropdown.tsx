'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { ChannelContext } from '@/app/context/channel-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hash } from 'lucide-react';
import type { Channel } from '@/app/(chat)/types/chat';

interface ChannelDropdownProps {
  currentChannel: Channel | null;
  channels: Channel[];
  children: React.ReactNode;
}

export function ChannelDropdown({ currentChannel, channels, children }: ChannelDropdownProps) {
  const router = useRouter();
  const { setSelectedChannel } = useContext(ChannelContext);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    router.push(`/chat/${channelId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {channels.map((channel) => (
          <DropdownMenuItem
            key={channel.id}
            className={`flex items-center gap-x-2 ${
              channel.id === currentChannel?.id ? 'bg-accent' : ''
            }`}
            onClick={() => handleChannelSelect(channel.id)}
          >
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{channel.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 