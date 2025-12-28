import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Attendee from '@/lib/models/Attendee';
import Event from '@/lib/models/Event';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
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
    
    const { attendeeId } = body;

    if (!attendeeId) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
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

    // Check if already approved
    if (attendee.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Attendee must be approved before check-in' }, { status: 400 });
    }

    // Update check-in status
    attendee.checkedIn = true;
    attendee.checkInTime = new Date();
    await attendee.save();

    return NextResponse.json({ 
      message: 'Check-in successful',
      attendee 
    });

  } catch (error) {
    console.error('Check-in Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


