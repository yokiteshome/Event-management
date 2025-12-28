import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description?: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  bannerImage?: string;
  status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    bannerImage: { type: String },
    status: { 
      type: String, 
      enum: ['ACTIVE', 'CLOSED', 'CANCELLED'], 
      default: 'ACTIVE' 
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventOwner', required: true },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
