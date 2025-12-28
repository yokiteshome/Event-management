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

    if (statusFilter && statusFilter !== 'any') {
      if (statusFilter === 'paid') {
        query.status = 'APPROVED';
      } else if (statusFilter === 'pending') {
        query.status = 'PENDING';
      } else if (statusFilter === 'refunded') {
        query.status = 'REJECTED';
      } else if (statusFilter === 'cancelled') {
        query.status = 'REJECTED';
      }
    }

    // Get attendees (tickets)
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

    // Format tickets
    const tickets = attendees.map((attendee, index) => {
      // Generate ticket ref from attendee ID
      const idStr = attendee._id.toString();
      const refNum = parseInt(idStr.slice(-5), 16) % 100000;
      const ticketRef = `#TR-${String(refNum).padStart(5, '0')}`;
      const event = attendee.eventId as any;
      
      // Determine ticket type based on status/date (mock logic)
      const ticketTypes = ['VIP All Access', 'Standard Pass', 'Early Bird', 'General Admission', 'Student Pass', 'Exhibitor'];
      const ticketType = ticketTypes[parseInt(idStr.slice(-1), 16) % ticketTypes.length];
      
      // Mock prices based on ticket type
      const priceMap: { [key: string]: number } = {
        'VIP All Access': 499,
        'Standard Pass': 150,
        'Early Bird': 89,
        'General Admission': 199,
        'Student Pass': 50,
        'Exhibitor': 800
      };
      const price = priceMap[ticketType] || 100;

      // Determine status
      let status = 'Pending';
      if (attendee.status === 'APPROVED') {
        status = 'Paid';
      } else if (attendee.status === 'REJECTED') {
        status = attendee.checkedIn ? 'Cancelled' : 'Refunded';
      }

      return {
        ticketRef,
        eventName: event?.name || 'Unknown Event',
        buyerName: attendee.name,
        buyerEmail: attendee.email,
        ticketType,
        price,
        dateSold: attendee.createdAt,
        status,
        checkedIn: attendee.checkedIn
      };
    });

    return NextResponse.json({ 
      tickets,
      total: tickets.length
    });

  } catch (error) {
    console.error('List Tickets Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

