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

    const activities: any[] = [];

    // Get recent owner registrations
    const recentOwners = await EventOwner.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    recentOwners.forEach(owner => {
      activities.push({
        type: 'owner',
        entity: owner.companyName,
        entityType: 'Organizer',
        action: owner.status === 'APPROVED' ? 'New event owner registration' : 'Pending verification request',
        date: owner.createdAt,
        status: owner.status === 'APPROVED' ? 'Approved' : owner.status === 'REJECTED' ? 'Rejected' : 'Pending',
        avatar: owner.companyName.charAt(0).toUpperCase()
      });
    });

    // Get recent events
    const recentEvents = await Event.find({})
      .populate('ownerId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(10);

    recentEvents.forEach(event => {
      activities.push({
        type: 'event',
        entity: event.name,
        entityType: 'Event',
        action: 'Event page updated',
        date: event.updatedAt || event.createdAt,
        status: 'Log',
        avatar: event.name.charAt(0).toUpperCase(),
        ownerName: (event.ownerId as any)?.companyName
      });
    });

    // Get recent attendees
    const recentAttendees = await Attendee.find({})
      .populate('eventId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    recentAttendees.forEach(attendee => {
      activities.push({
        type: 'attendee',
        entity: attendee.name,
        entityType: 'Attendee',
        action: attendee.status === 'APPROVED' ? 'Ticket purchase' : 'Registration pending',
        date: attendee.createdAt,
        status: attendee.status === 'APPROVED' ? 'Completed' : attendee.status === 'REJECTED' ? 'Rejected' : 'Pending',
        avatar: attendee.name.charAt(0).toUpperCase(),
        eventName: (attendee.eventId as any)?.name
      });
    });

    // Sort by date and take most recent
    const sortedActivities = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
      .map(activity => ({
        ...activity,
        date: new Date(activity.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      }));

    return NextResponse.json({ activities: sortedActivities });

  } catch (error) {
    console.error('Admin Activities Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

