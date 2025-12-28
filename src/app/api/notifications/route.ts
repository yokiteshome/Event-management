import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Notification from '@/lib/models/Notification';
import { getCurrentUser } from '@/lib/auth';

// GET: Fetch notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // For admin, userId is 'admin', for owners it's their ObjectId
    const userId = user.role === 'ADMIN' ? 'admin' : user.id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });

  } catch (error) {
    console.error('Get Notifications Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = user.role === 'ADMIN' ? 'admin' : user.id;
    
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request body' 
      }, { status: 400 });
    }

    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read
      await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );
    } else if (notificationId) {
      // Mark specific notification as read
      await Notification.findByIdAndUpdate(
        notificationId,
        { read: true }
      );
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Notifications updated successfully' 
    });

  } catch (error) {
    console.error('Update Notifications Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

