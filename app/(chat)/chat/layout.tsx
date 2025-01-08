'use client';

import { Sidebar } from '@/components/chat/sidebar';
import { useState } from 'react';
import { ChannelContext } from '@/app/context/channel-context';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <ChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ChannelContext.Provider>
  );
}