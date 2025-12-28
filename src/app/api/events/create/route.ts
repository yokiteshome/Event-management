import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import { createEventSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
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
    
    // Validate input
    const result = createEventSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return NextResponse.json({ 
        error: firstError?.message || 'Invalid input. Please check all required fields.' 
      }, { status: 400 });
    }

    const { name, description, date, startDate, endDate, location, capacity, bannerImage } = result.data;

    // Create Event
    const newEvent = await Event.create({
      name,
      description,
      date: new Date(date),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      capacity: capacity || 1000,
      bannerImage,
      ownerId: user.id
    });

    return NextResponse.json({ 
      message: 'Event created successfully',
      event: newEvent 
    }, { status: 201 });

  } catch (error) {
    console.error('Create Event Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
