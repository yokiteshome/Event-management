import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendee extends Document {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  eventId: mongoose.Types.ObjectId;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  checkedIn: boolean;
  checkInTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendeeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    notes: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'APPROVED', 'REJECTED'], 
      default: 'PENDING' 
    },
    checkedIn: { type: Boolean, default: false },
    checkInTime: { type: Date },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registration for same event
AttendeeSchema.index({ email: 1, eventId: 1 }, { unique: true });

const Attendee: Model<IAttendee> = mongoose.models.Attendee || mongoose.model<IAttendee>('Attendee', AttendeeSchema);

export default Attendee;
