import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import { isAdmin } from '@/lib/auth';
import { notifyOwnerOfStatusChange } from '@/lib/notifications';

// GET: List all owners
export async function GET(req: NextRequest) {
  try {
    // Check admin auth
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    
    const owners = await EventOwner.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return NextResponse.json({ owners });

  } catch (error) {
    console.error('Get Owners Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update owner status (approve/reject)
export async function PATCH(req: NextRequest) {
  try {
    // Check admin auth
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request body. Please check your input.' 
      }, { status: 400 });
    }
    
    const { ownerId, status } = body;

    if (!ownerId || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const owner = await EventOwner.findByIdAndUpdate(
      ownerId,
      { status },
      { new: true }
    ).select('-passwordHash');

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Notify owner of status change (only for APPROVED/REJECTED)
    if (status === 'APPROVED' || status === 'REJECTED') {
      await notifyOwnerOfStatusChange(ownerId, status);
    }

    return NextResponse.json({ 
      message: `Owner ${status.toLowerCase()} successfully`,
      owner 
    });

  } catch (error) {
    console.error('Update Owner Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
