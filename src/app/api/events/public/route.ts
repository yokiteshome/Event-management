import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import EventOwner from '@/lib/models/EventOwner';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const date = searchParams.get('date') || '';
    
    // Find the specific owner by email (ethiotele@gmail.com)
    const specialOwner = await EventOwner.findOne({ email: 'ethiotele@gmail.com' });
    const specialOwnerId = specialOwner?._id;
    
    // Build query for regular events (with date and status filters)
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 7); // Include events from past 7 days
    pastWeek.setHours(0, 0, 0, 0);
    
    const regularQuery: any = {
      date: { $gte: pastWeek },
      $or: [
        { status: { $ne: 'CANCELLED' } },
        { status: { $exists: false } }
      ]
    };
    
    // Exclude special owner's events from regular query (we'll fetch them separately)
    if (specialOwnerId) {
      regularQuery.ownerId = { $ne: specialOwnerId };
    }
    
    // Query for ALL events from ethiotele@gmail.com (no date restrictions, only exclude CANCELLED)
    const specialOwnerQuery: any = {};
    if (specialOwnerId) {
      specialOwnerQuery.ownerId = specialOwnerId;
      specialOwnerQuery.$or = [
        { status: { $ne: 'CANCELLED' } },
        { status: { $exists: false } }
      ];
    }
    
    // Apply search filter
    const searchRegex = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    } : null;
    
    if (searchRegex) {
      regularQuery.$and = regularQuery.$and || [];
      regularQuery.$and.push(searchRegex);
      if (specialOwnerId) {
        specialOwnerQuery.$and = specialOwnerQuery.$and || [];
        specialOwnerQuery.$and.push(searchRegex);
      }
    }
    
    // Apply location filter
    if (location && location !== 'All Locations') {
      regularQuery.location = { $regex: location, $options: 'i' };
      if (specialOwnerId) {
        specialOwnerQuery.location = { $regex: location, $options: 'i' };
      }
    }
    
    // Fetch events separately and combine
    const [regularEvents, specialEvents] = await Promise.all([
      Event.find(regularQuery)
        .populate('ownerId', 'companyName logoUrl email')
        .sort({ date: 1 })
        .limit(200),
      specialOwnerId ? Event.find(specialOwnerQuery)
        .populate('ownerId', 'companyName logoUrl email')
        .sort({ date: 1 })
        .limit(200) : []
    ]);
    
    // Combine all events
    let allEvents = [...regularEvents, ...specialEvents];
    
    // Remove duplicates (in case of any overlap)
    const uniqueEvents = Array.from(
      new Map(allEvents.map(event => [event._id.toString(), event])).values()
    );
    
    // Sort by date
    uniqueEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
    
    // Filter out events where owner population failed
    const events = uniqueEvents.filter(event => event.ownerId && (event.ownerId as any)._id);
    
    // Log for debugging
    const ethioteleEvents = events.filter(e => (e.ownerId as any)?.email === 'ethiotele@gmail.com');
    console.log(`Found ${events.length} total events (${ethioteleEvents.length} from ethiotele@gmail.com)`);
    
    return NextResponse.json({ events });

  } catch (error) {
    console.error('Public Events Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

