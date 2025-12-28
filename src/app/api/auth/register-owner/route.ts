import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import { registerOwnerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { notifyAdminOfOwnerRegistration } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Handle FormData (multipart/form-data)
    const formData = await req.formData();
    
    // Extract form fields
    const companyName = formData.get('companyName') as string;
    const ownerFullName = formData.get('ownerFullName') as string | null;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string | null;
    const password = formData.get('password') as string;
    const companyDocumentFile = formData.get('companyDocument') as File | null;
    
    // Convert file to base64 if present
    let companyDocumentBase64: string | undefined;
    if (companyDocumentFile && companyDocumentFile.size > 0) {
      const arrayBuffer = await companyDocumentFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      companyDocumentBase64 = `data:${companyDocumentFile.type};base64,${buffer.toString('base64')}`;
    }
    
    // Prepare body for validation (convert empty strings to undefined)
    const body = {
      companyName: companyName?.trim() || '',
      ownerFullName: ownerFullName?.trim() || undefined,
      email: email?.trim() || '',
      phoneNumber: phoneNumber?.trim() || undefined,
      password: password || '',
      companyDocument: companyDocumentBase64,
    };
    
    // Validate input
    const result = registerOwnerSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json({ 
        error: firstError?.message || 'Invalid input. Please check all required fields.' 
      }, { status: 400 });
    }

    const { companyName: validatedCompanyName, email: validatedEmail, password: validatedPassword, ownerFullName: validatedOwnerFullName, phoneNumber: validatedPhoneNumber, companyDocument: validatedCompanyDocument } = result.data;

    // Check if email exists
    const existing = await EventOwner.findOne({ email: validatedEmail });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedPassword, 10);

    // Create Owner
    const newOwner = await EventOwner.create({
      companyName: validatedCompanyName,
      ownerFullName: validatedOwnerFullName,
      email: validatedEmail,
      phoneNumber: validatedPhoneNumber,
      passwordHash,
      companyDocument: validatedCompanyDocument,
      status: 'PENDING' // Default
    });

    // Notify admin of new registration
    await notifyAdminOfOwnerRegistration(newOwner._id.toString());

    return NextResponse.json({ 
      message: 'Registration successful. Waiting for Admin approval.',
      ownerId: newOwner._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration Error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
