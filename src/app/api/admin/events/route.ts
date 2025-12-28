import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import Attendee from '@/lib/models/Attendee';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const hostCompany = searchParams.get('hostCompany') || 'all';

    // Build query
    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Host company filter
    if (hostCompany !== 'all') {
      // We'll filter after populating ownerId
    }

    // Get all events with owner info
    let events = await Event.find(query)
      .populate('ownerId', 'companyName logoUrl')
      .sort({ date: -1 });

    // Filter by host company if specified
    if (hostCompany !== 'all') {
      events = events.filter((e: any) => 
        e.ownerId && (e.ownerId as any).companyName === hostCompany
      );
    }

    // Get attendee counts for each event
    const eventsWithAttendees = await Promise.all(
      events.map(async (event: any) => {
        const attendeeCount = await Attendee.countDocuments({ 
          eventId: event._id,
          status: 'APPROVED'
        });

        // Determine status based on date
        const now = new Date();
        const eventDate = new Date(event.date);
        let eventStatus = 'Past';
        if (eventDate > now) {
          eventStatus = 'Upcoming';
        } else if (eventDate <= now && event.endDate && new Date(event.endDate) >= now) {
          eventStatus = 'Ongoing';
        }

        return {
          _id: event._id,
          name: event.name,
          date: event.date,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          capacity: event.capacity,
          ownerId: event.ownerId,
          createdAt: event.createdAt,
          attendeeCount,
          status: eventStatus
        };
      })
    );

    // Apply status filter
    let filteredEvents = eventsWithAttendees;
    if (status !== 'all') {
      filteredEvents = eventsWithAttendees.filter((e: any) => e.status === status);
    }

    // Get unique host companies for filter dropdown
    const hostCompanies = Array.from(
      new Set(
        events
          .map((e: any) => (e.ownerId as any)?.companyName)
          .filter((name: string) => name)
      )
    ).sort();

    return NextResponse.json({
      events: filteredEvents,
      hostCompanies,
      total: filteredEvents.length
    });

  } catch (error) {
    console.error('Admin Events Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

