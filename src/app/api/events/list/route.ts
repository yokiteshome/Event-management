import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Check auth
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    
    // Get events for this owner
    const events = await Event.find({ ownerId: user.id })
      .sort({ date: -1 });

    return NextResponse.json({ events });

  } catch (error) {
    console.error('List Events Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
