import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import EventOwner from '@/lib/models/EventOwner';
import Event from '@/lib/models/Event';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const tasks: any[] = [];

    // Get pending owners that need verification
    const pendingOwners = await EventOwner.find({ status: 'PENDING' })
      .sort({ createdAt: 1 })
      .limit(5);

    pendingOwners.forEach(owner => {
      const daysAgo = Math.floor((Date.now() - new Date(owner.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      tasks.push({
        type: 'verification',
        title: `Verify '${owner.companyName}'`,
        description: `Submitted ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago. Documents pending review.`,
        priority: 'high',
        action: 'Review Now',
        ownerId: owner._id.toString()
      });
    });

    // Mock refund tasks (can be enhanced with actual refund system)
    // For now, we'll add a placeholder
    if (tasks.length < 2) {
      tasks.push({
        type: 'refund',
        title: 'Refund: User #8821',
        description: "Claim: 'Event cancelled without notice'.",
        priority: 'high',
        action: 'Process Refund',
        userId: '8821'
      });
    }

    return NextResponse.json({ tasks: tasks.slice(0, 5) });

  } catch (error) {
    console.error('Urgent Tasks Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

