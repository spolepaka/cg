'use client';

import { Sidebar } from '@/components/chat/sidebar';
import { useState, useEffect } from 'react';
import { ChannelContext } from '@/app/context/channel-context';
import { usePathname } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const pathname = usePathname();

  // Set initial channel from URL
  useEffect(() => {
    const channelId = pathname.split('/').pop();
    if (channelId && channelId !== 'chat') {
      setSelectedChannel(channelId);
    }
  }, [pathname]);

  return (
    <ChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ChannelContext.Provider>
  );
}