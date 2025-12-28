import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If admin, return admin data
    if (user.role === 'ADMIN') {
      return NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role,
        name: 'Admin User',
        fullName: 'Admin User',
        companyName: 'EventAdmin',
        status: 'APPROVED'
      });
    }

    // If owner, fetch from database
    await connectDB();
    const owner = await EventOwner.findById(user.id);
    
    if (!owner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: owner._id.toString(),
      email: owner.email,
      role: user.role,
      name: owner.ownerFullName || owner.companyName,
      fullName: owner.ownerFullName,
      companyName: owner.companyName,
      phoneNumber: owner.phoneNumber,
      logoUrl: owner.logoUrl,
      status: owner.status
    });

  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

