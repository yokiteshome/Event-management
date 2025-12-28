'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalEvents: number;
  registeredAttendees: number;
  totalCheckIns: number;
  activeEvents: number;
}

interface RecentActivity {
  activity: string;
  eventName: string;
  user: string;
  time: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    registeredAttendees: 0,
    totalCheckIns: 0,
    activeEvents: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch('/api/dashboard/stats');
      if (res.status === 403) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setStats(data.stats || stats);
      setRecentActivity(data.recentActivity || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/dashboard/events/create">
            <button className="bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Registered Attendees</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.registeredAttendees.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Check-ins</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCheckIns.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Events</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
          </div>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ACTIVITY</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">EVENT NAME</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">USER</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No recent activity
                      </td>
                    </tr>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-700">{activity.activity}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{activity.eventName}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{activity.user}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/events/create">
                <button className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Event
                </button>
              </Link>
              <Link href="/dashboard/events">
                <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors text-left flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  View All Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
