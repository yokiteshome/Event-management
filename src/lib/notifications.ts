import connectDB from '@/lib/db/connect';
import Notification, { NotificationType } from '@/lib/models/Notification';
import EventOwner from '@/lib/models/EventOwner';
import Event from '@/lib/models/Event';

interface CreateNotificationParams {
  userId: string | 'admin';
  type: NotificationType;
  title: string;
  message: string;
  metadata?: {
    ownerId?: string;
    eventId?: string;
    attendeeId?: string;
    status?: string;
    [key: string]: any;
  };
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    await connectDB();
    
    await Notification.create({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata || {},
      read: false
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are non-critical
  }
}

// Notify admin of new owner registration
export async function notifyAdminOfOwnerRegistration(ownerId: string) {
  try {
    await connectDB();
    const owner = await EventOwner.findById(ownerId);
    
    if (!owner) return;

    await createNotification({
      userId: 'admin',
      type: 'OWNER_REGISTRATION',
      title: 'New Event Owner Registration',
      message: `${owner.companyName} has registered and is waiting for approval.`,
      metadata: {
        ownerId: owner._id.toString()
      }
    });
  } catch (error) {
    console.error('Error notifying admin of owner registration:', error);
  }
}

// Notify owner when approved/rejected
export async function notifyOwnerOfStatusChange(ownerId: string, status: 'APPROVED' | 'REJECTED') {
  try {
    await connectDB();
    const owner = await EventOwner.findById(ownerId);
    
    if (!owner) return;

    const title = status === 'APPROVED' 
      ? 'Registration Approved' 
      : 'Registration Rejected';
    
    const message = status === 'APPROVED'
      ? `Your registration has been approved! You can now log in and start creating events.`
      : `Your registration has been rejected. Please contact support for more information.`;

    await createNotification({
      userId: owner._id.toString(),
      type: status === 'APPROVED' ? 'OWNER_APPROVED' : 'OWNER_REJECTED',
      title,
      message,
      metadata: {
        ownerId: owner._id.toString(),
        status
      }
    });
  } catch (error) {
    console.error('Error notifying owner of status change:', error);
  }
}

// Notify event owner of new attendee registration
export async function notifyOwnerOfNewAttendee(eventId: string, attendeeId: string, attendeeName: string) {
  try {
    await connectDB();
    const event = await Event.findById(eventId);
    
    if (!event) return;

    const ownerId = event.ownerId.toString();

    await createNotification({
      userId: ownerId,
      type: 'NEW_ATTENDEE',
      title: 'New Attendee Registration',
      message: `${attendeeName} has registered for your event "${event.name}".`,
      metadata: {
        eventId: event._id.toString(),
        attendeeId
      }
    });
  } catch (error) {
    console.error('Error notifying owner of new attendee:', error);
  }
}

