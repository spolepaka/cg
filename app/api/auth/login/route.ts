import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return NextResponse.json({ session: data.session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid login credentials' },
      { status: 401 }
    );
  }
}