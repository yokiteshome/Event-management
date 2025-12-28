import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Attendee from '@/lib/models/Attendee';
import Event from '@/lib/models/Event';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    // Check auth
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request body. Please check your input.' 
      }, { status: 400 });
    }
    
    const { attendeeId, status } = body;

    if (!attendeeId || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const attendee = await Attendee.findById(attendeeId);
    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    // Verify owner owns the event
    const event = await Event.findById(attendee.eventId);
    if (!event || event.ownerId.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update status
    attendee.status = status;
    await attendee.save();

    return NextResponse.json({ 
      message: `Attendee ${status.toLowerCase()} successfully`,
      attendee 
    });

  } catch (error) {
    console.error('Approve Attendee Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
