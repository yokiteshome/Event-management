import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Attendee from '@/lib/models/Attendee';
import Event from '@/lib/models/Event';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Get all events for this owner
    const events = await Event.find({ ownerId: user.id });
    const eventIds = events.map(e => e._id);

    // Get all attendees (tickets) for owner's events
    const attendees = await Attendee.find({ eventId: { $in: eventIds } });

    // Calculate statistics
    const approvedAttendees = attendees.filter(a => a.status === 'APPROVED');
    const totalTicketsSold = approvedAttendees.length;
    
    // Calculate revenue (mock - using average price of $150 per ticket)
    const totalRevenue = totalTicketsSold * 150;
    
    const activeCheckIns = attendees.filter(a => a.checkedIn).length;
    const refunded = attendees.filter(a => a.status === 'REJECTED').length;

    return NextResponse.json({
      stats: {
        totalTicketsSold,
        totalRevenue,
        activeCheckIns,
        refunded
      }
    });

  } catch (error) {
    console.error('Tickets Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

