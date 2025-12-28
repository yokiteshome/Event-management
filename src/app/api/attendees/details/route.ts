import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Attendee from '@/lib/models/Attendee';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const attendeeId = searchParams.get('id');

    if (!attendeeId) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
    }

    await connectDB();
    
    const attendee = await Attendee.findById(attendeeId).populate({
      path: 'eventId',
      populate: {
        path: 'ownerId',
        select: 'companyName logoUrl'
      }
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    return NextResponse.json({ attendee });

  } catch (error) {
    console.error('Get Attendee Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
