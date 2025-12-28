import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import Event from '@/lib/models/Event';
import Attendee from '@/lib/models/Attendee';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Get all owners
    const owners = await EventOwner.find({});
    const totalOwners = owners.length;
    const pendingOwners = owners.filter(o => o.status === 'PENDING').length;

    // Get all events
    const events = await Event.find({});
    const totalEvents = events.length;

    // Get all attendees
    const attendees = await Attendee.find({});
    const totalAttendees = attendees.length;

    // Calculate percentage changes (mock data for now - can be enhanced with historical data)
    const ownerChange = 12; // 12% increase
    const eventChange = 5; // 5% increase
    const attendeeChange = 8; // 8% increase

    return NextResponse.json({
      stats: {
        totalOwners,
        pendingApprovals: pendingOwners,
        totalEvents,
        totalAttendees,
        ownerChange,
        eventChange,
        attendeeChange
      }
    });

  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

