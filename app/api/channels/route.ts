import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { workspaceId, name } = await request.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Start a transaction
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .insert([
        { workspace_id: workspaceId, name }
      ])
      .select()
      .single();

    if (channelError) throw channelError;

    // Add the creator as a channel member
    const { error: memberError } = await supabase
      .from('channel_members')
      .insert([
        { channel_id: channel.id, user_id: user.id }
      ]);

    if (memberError) throw memberError;

    return NextResponse.json({ channel });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating channel' },
      { status: 500 }
    );
  }
}