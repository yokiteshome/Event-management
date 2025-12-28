import { z } from 'zod';

export const registerOwnerSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  ownerFullName: z.string().min(2, "Owner full name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  logoUrl: z.string().optional(), // Can be empty initially or a URL
  companyDocument: z.string().optional(), // Base64 encoded file
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  date: z.string(), // ISO string from frontend date picker
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(3),
  capacity: z.coerce.number().min(1).optional(),
  bannerImage: z.string().optional(),
});

export const updateEventSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(3).optional(),
  capacity: z.coerce.number().min(1).optional(),
  bannerImage: z.string().optional(),
  status: z.enum(['ACTIVE', 'CLOSED', 'CANCELLED']).optional(),
});

export const registerAttendeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  eventId: z.string(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  sendEmail: z.boolean().optional(),
});
