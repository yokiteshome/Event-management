import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 
  | 'OWNER_REGISTRATION' // Admin gets notified of new owner registration
  | 'OWNER_APPROVED' // Owner gets notified when approved
  | 'OWNER_REJECTED' // Owner gets notified when rejected
  | 'NEW_ATTENDEE'; // Owner gets notified when new attendee registers

export interface INotification extends Document {
  userId: string; // User who receives the notification ('admin' for admin, ObjectId string for owners)
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: {
    ownerId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
    attendeeId?: mongoose.Types.ObjectId;
    status?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true 
    },
    type: { 
      type: String, 
      enum: ['OWNER_REGISTRATION', 'OWNER_APPROVED', 'OWNER_REJECTED', 'NEW_ATTENDEE'],
      required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for efficient queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

