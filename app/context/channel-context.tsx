'use client';

import { createContext } from 'react';

export const ChannelContext = createContext<{
  selectedChannel: string | null;
  setSelectedChannel: (id: string | null) => void;
}>({
  selectedChannel: null,
  setSelectedChannel: () => {},
});