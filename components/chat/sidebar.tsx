'use client';

import { useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LogOut, 
  Plus,
  Hash,
  Sparkles,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { ChannelContext } from '@/app/context/channel-context';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Channel } from '@/app/(chat)/types/chat';

export function Sidebar() {
  const router = useRouter();
  const { selectedChannel, setSelectedChannel } = useContext(ChannelContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [editingChannel, setEditingChannel] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const fetchChannels = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) {
        setChannels(data as Channel[]);
        const currentChannelId = pathname.split('/').pop();
        if (!currentChannelId || currentChannelId === 'chat') {
          if (data.length > 0) {
            setSelectedChannel(data[0].id);
            router.push(`/chat/${data[0].id}`);
          }
        }
      }
    };

    fetchChannels();

    const channelsSubscription = supabase
      .channel('channels')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channels'
      }, () => {
        fetchChannels();
      })
      .subscribe();

    return () => {
      channelsSubscription.unsubscribe();
    };
  }, [pathname, router, setSelectedChannel]);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        console.error('Profile not found');
        return;
      }

      const { data: channel, error } = await supabase
        .from('channels')
        .insert([{ 
          name: newChannel,
          created_by: profile.id 
        }])
        .select()
        .single();

      if (error) throw error;

      if (channel) {
        await supabase
          .from('channel_members')
          .insert([{ channel_id: channel.id, user_id: profile.id }]);
        
        setSelectedChannel(channel.id);
      }

      setNewChannel('');
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const startEditing = (channel: Channel) => {
    setEditingChannel(channel.id);
    setEditName(channel.name);
  };

  const handleRename = async (channelId: string) => {
    if (!editName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('channels')
        .update({ name: editName })
        .eq('id', channelId);
      
      if (error) throw error;
      
      setEditingChannel(null);
      setEditName('');
    } catch (error) {
      console.error('Error renaming channel:', error);
    }
  };

  const cancelEditing = () => {
    setEditingChannel(null);
    setEditName('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    router.push(`/chat/${channelId}`);
  };

  return (
    <div className="w-64 bg-card border-r flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-card-foreground">ChatGenius</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <form onSubmit={handleCreateChannel} className="mb-4">
            <div className="flex space-x-2">
              <Input
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                placeholder="Create channel"
                className="h-9"
              />
              <Button type="submit" size="sm" variant="ghost" className="px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="space-y-1">
            {channels.map((channel) => (
              <div key={channel.id} className="group flex items-center">
                {editingChannel === channel.id ? (
                  <div className="flex items-center space-x-1 w-full">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRename(channel.id);
                        } else if (e.key === 'Escape') {
                          cancelEditing();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRename(channel.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-8 px-2 ${
                      selectedChannel === channel.id 
                        ? 'bg-primary/20 text-primary hover:bg-primary/25 border-l-2 border-primary' 
                        : 'text-muted-foreground hover:text-card-foreground'
                    } group-hover:w-[calc(100%-32px)]`}
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <Hash className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </Button>
                )}
                {editingChannel !== channel.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => startEditing(channel)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground h-8"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}