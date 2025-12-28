import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import { loginSchema } from '@/lib/validations';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Hardcoded admin credentials for V1
const ADMIN_EMAIL = 'admin@eventplatform.com';
const ADMIN_PASSWORD = 'admin123'; // In production, this should be hashed and stored securely

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
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return NextResponse.json({ 
        error: firstError?.message || 'Invalid input. Please check all required fields.' 
      }, { status: 400 });
    }

    const { email, password } = result.data;

    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = signToken({
        id: 'admin',
        role: 'ADMIN',
        email: ADMIN_EMAIL
      });

      const response = NextResponse.json({ 
        message: 'Login successful',
        role: 'ADMIN'
      });
      
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    // Check for owner login
    const owner = await EventOwner.findOne({ email });
    if (!owner) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, owner.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if approved
    if (owner.status !== 'APPROVED') {
      return NextResponse.json({ 
        error: `Your account is ${owner.status.toLowerCase()}. Please wait for admin approval.` 
      }, { status: 403 });
    }

    // Generate token
    const token = signToken({
      id: owner._id.toString(),
      role: 'OWNER',
      email: owner.email
    });

    const response = NextResponse.json({ 
      message: 'Login successful',
      role: 'OWNER',
      companyName: owner.companyName
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
