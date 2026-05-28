import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { seatId } = await request.json();

    if (!seatId) {
      return NextResponse.json({ error: 'Seat ID is required' }, { status: 400 });
    }

    // THE STAMPEDE SOLVER: Atomic Update
    // We only update the row IF the status is currently 'AVAILABLE'.
    // Postgres guarantees this operation is atomic. If 100,000 people try this
    // on seatId 42, only the very first one will successfully return data.
    const { data, error } = await supabase
      .from('seats')
      .update({ status: 'RESERVED' })
      .eq('id', seatId)
      .eq('status', 'AVAILABLE')
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // If data is empty, it means the WHERE clause failed (the seat was no longer AVAILABLE)
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Seat Taken! Someone beat you to it.' },
        { status: 409 }
      );
    }

    // Success! The seat is locked.
    return NextResponse.json({ success: true, seat: data[0] });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
