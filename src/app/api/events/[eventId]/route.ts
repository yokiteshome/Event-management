import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Event from '@/lib/models/Event';
import EventOwner from '@/lib/models/EventOwner';
import { updateEventSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    await connectDB();
    
    const event = await Event.findById(eventId).populate('ownerId', 'companyName logoUrl');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Get Event Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    // Check auth
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { eventId } = await params;
    await connectDB();
    
    // Get the event and verify ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.ownerId.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized - You can only edit your own events' }, { status: 403 });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request body. Please check your input.' 
      }, { status: 400 });
    }

    // Validate input
    const result = updateEventSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return NextResponse.json({ 
        error: firstError?.message || 'Invalid input. Please check all required fields.' 
      }, { status: 400 });
    }

    const updateData: any = {};

    // Update fields if provided
    if (result.data.name !== undefined) updateData.name = result.data.name;
    if (result.data.description !== undefined) updateData.description = result.data.description;
    if (result.data.location !== undefined) updateData.location = result.data.location;
    if (result.data.capacity !== undefined) updateData.capacity = result.data.capacity;
    if (result.data.bannerImage !== undefined) updateData.bannerImage = result.data.bannerImage;
    if (result.data.status !== undefined) updateData.status = result.data.status;

    // Handle date fields
    if (result.data.date) updateData.date = new Date(result.data.date);
    if (result.data.startDate) updateData.startDate = new Date(result.data.startDate);
    if (result.data.endDate) updateData.endDate = new Date(result.data.endDate);

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    ).populate('ownerId', 'companyName logoUrl');

    return NextResponse.json({ 
      message: 'Event updated successfully',
      event: updatedEvent 
    }, { status: 200 });

  } catch (error) {
    console.error('Update Event Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
