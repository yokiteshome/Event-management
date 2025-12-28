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

    const { searchParams } = new URL(req.url);
    const eventFilter = searchParams.get('event');
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search') || '';

    // Get all events for this owner
    const events = await Event.find({ ownerId: user.id });
    const eventIds = events.map(e => e._id);

    // Build query
    let query: any = { eventId: { $in: eventIds } };

    if (eventFilter && eventFilter !== 'all') {
      query.eventId = eventFilter;
    }

    // Get all attendees for owner's events
    let attendees = await Attendee.find(query)
      .populate('eventId', 'name')
      .sort({ createdAt: -1 });

    // Apply search filter
    if (search) {
      attendees = attendees.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a._id.toString().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'checked-in') {
        attendees = attendees.filter(a => a.checkedIn);
      } else if (statusFilter === 'registered') {
        attendees = attendees.filter(a => a.status === 'APPROVED' && !a.checkedIn);
      } else if (statusFilter === 'cancelled') {
        attendees = attendees.filter(a => a.status === 'REJECTED');
      } else if (statusFilter === 'pending') {
        attendees = attendees.filter(a => a.status === 'PENDING');
      }
    }

    // Format attendees
    const formattedAttendees = attendees.map(attendee => {
      const event = attendee.eventId as any;
      
      // Determine ticket type (mock - can be enhanced)
      const ticketTypes = ['VIP Ticket', 'Early Bird', 'General Admission', 'Speaker', 'Standard Pass'];
      const ticketType = ticketTypes[attendee._id.toString().charCodeAt(attendee._id.toString().length - 1) % ticketTypes.length];

      // Determine status
      let status = 'Registered';
      if (attendee.checkedIn) {
        status = 'Checked in';
      } else if (attendee.status === 'REJECTED') {
        status = 'Cancelled';
      } else if (attendee.status === 'PENDING') {
        status = 'Pending';
      }

      return {
        _id: attendee._id.toString(),
        name: attendee.name,
        email: attendee.email,
        eventName: event?.name || 'Unknown Event',
        ticketType,
        registrationDate: attendee.createdAt,
        status,
        checkedIn: attendee.checkedIn,
        attendeeStatus: attendee.status
      };
    });

    return NextResponse.json({ 
      attendees: formattedAttendees,
      total: formattedAttendees.length
    });

  } catch (error) {
    console.error('List All Attendees Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


