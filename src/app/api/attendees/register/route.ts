import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Attendee from '@/lib/models/Attendee';
import Event from '@/lib/models/Event';
import { registerAttendeeSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';
import { notifyOwnerOfNewAttendee } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
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
    const result = registerAttendeeSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return NextResponse.json({ 
        error: firstError?.message || 'Invalid input. Please check all required fields.' 
      }, { status: 400 });
    }

    const { name, email, eventId, phone, notes, sendEmail } = result.data;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is owner (for auto-approval) or public registration
    const user = await getCurrentUser(req);
    const isOwner = user && user.role === 'OWNER' && event.ownerId.toString() === user.id;
    
    // Check capacity
    const attendeeCount = await Attendee.countDocuments({ eventId, status: 'APPROVED' });
    if (attendeeCount >= event.capacity) {
      return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 });
    }

    // Create Attendee (will fail if duplicate due to unique index)
    // Auto-approve if registered by event owner
    const newAttendee = await Attendee.create({
      name,
      email,
      phone: phone || undefined,
      notes: notes || undefined,
      eventId,
      status: isOwner ? 'APPROVED' : 'PENDING'
    });

    // Notify event owner of new attendee registration (only if not registered by owner themselves)
    if (!isOwner) {
      await notifyOwnerOfNewAttendee(eventId, newAttendee._id.toString(), name);
    }

    // TODO: Send email if sendEmail is true (email functionality can be added later)
    if (sendEmail && isOwner) {
      // Email sending logic would go here
      console.log('Email would be sent to:', email);
    }

    return NextResponse.json({ 
      message: isOwner 
        ? 'Attendee registered and approved successfully.' 
        : 'Registration successful. Waiting for approval.',
      attendeeId: newAttendee._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register Attendee Error:', error);
    
    // Handle duplicate registration
    if (error.code === 11000) {
      return NextResponse.json({ error: 'This email is already registered for this event' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
