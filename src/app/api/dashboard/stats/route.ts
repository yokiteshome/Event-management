import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import Attendee from '@/lib/models/Attendee';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Check auth
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Get all events for this owner
    const events = await Event.find({ ownerId: user.id });
    const eventIds = events.map(e => e._id);

    // Get all attendees for owner's events
    const attendees = await Attendee.find({ eventId: { $in: eventIds } });

    // Calculate statistics
    const totalEvents = events.length;
    const registeredAttendees = attendees.length;
    const totalCheckIns = attendees.filter(a => a.checkedIn).length;
    const activeEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      const now = new Date();
      return eventDate >= now;
    }).length;

    // Get recent activity (last 20 activities - registrations and check-ins)
    const recentAttendees = await Attendee.find({ eventId: { $in: eventIds } })
      .populate('eventId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    const activities: any[] = [];

    // Add registration activities
    recentAttendees.forEach(attendee => {
      if (attendee.status === 'APPROVED') {
        activities.push({
          activity: 'New attendee registered',
          eventName: (attendee.eventId as any)?.name || 'Unknown Event',
          user: attendee.name,
          time: getTimeAgo(attendee.createdAt),
          timestamp: attendee.createdAt.getTime()
        });
      }
    });

    // Add check-in activities
    const checkedInAttendees = await Attendee.find({ 
      eventId: { $in: eventIds },
      checkedIn: true 
    })
      .populate('eventId', 'name')
      .sort({ checkInTime: -1 })
      .limit(10);

    checkedInAttendees.forEach(attendee => {
      if (attendee.checkInTime) {
        activities.push({
          activity: 'Check-in',
          eventName: (attendee.eventId as any)?.name || 'Unknown Event',
          user: attendee.name,
          time: getTimeAgo(attendee.checkInTime),
          timestamp: attendee.checkInTime.getTime()
        });
      }
    });

    // Sort by timestamp and take most recent 10
    const recentActivity = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(({ timestamp, ...rest }) => rest);

    return NextResponse.json({
      stats: {
        totalEvents,
        registeredAttendees,
        totalCheckIns,
        activeEvents
      },
      recentActivity
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

