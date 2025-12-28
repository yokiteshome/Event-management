import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventOwner extends Document {
  companyName: string;
  ownerFullName?: string;
  email: string;
  phoneNumber?: string;
  passwordHash: string;
  logoUrl?: string;
  companyDocument?: string; // Base64 encoded file or file path
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const EventOwnerSchema: Schema = new Schema(
  {
    companyName: { type: String, required: true },
    ownerFullName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    passwordHash: { type: String, required: true },
    logoUrl: { type: String },
    companyDocument: { type: String }, // Base64 encoded file or file path
    status: { 
      type: String, 
      enum: ['PENDING', 'APPROVED', 'REJECTED'], 
      default: 'PENDING' 
    },
  },
  { timestamps: true }
);

const EventOwner: Model<IEventOwner> = mongoose.models.EventOwner || mongoose.model<IEventOwner>('EventOwner', EventOwnerSchema);

export default EventOwner;
