import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('workspaces')
      .insert([
        { name, owner_id: user.id }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ workspace: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating workspace' },
      { status: 500 }
    );
  }
}