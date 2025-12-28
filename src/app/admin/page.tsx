'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Zap, 
  Calendar, 
  Users, 
  Download, 
  Plus, 
  Search,
  ArrowRight,
  List,
  BarChart3,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalOwners: number;
  pendingApprovals: number;
  totalEvents: number;
  totalAttendees: number;
  ownerChange: number;
  eventChange: number;
  attendeeChange: number;
}

interface Activity {
  type: string;
  entity: string;
  entityType: string;
  action: string;
  date: string;
  status: string;
  avatar: string;
}

interface UrgentTask {
  type: string;
  title: string;
  description: string;
  priority: string;
  action: string;
  ownerId?: string;
  userId?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOwners: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    totalAttendees: 0,
    ownerChange: 0,
    eventChange: 0,
    attendeeChange: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<UrgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, tasksRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activities'),
          fetch('/api/admin/urgent-tasks')
        ]);

        if (statsRes.status === 403 || activitiesRes.status === 403 || tasksRes.status === 403) {
          router.push('/auth/login');
          return;
        }

        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();
        const tasksData = await tasksRes.json();

        setStats(statsData.stats || stats);
        setActivities(activitiesData.activities || []);
        setUrgentTasks(tasksData.tasks || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleExportReport = () => {
    // Export functionality
    console.log('Exporting report...');
    alert('Export functionality coming soon!');
  };

  const handleReviewTask = (task: UrgentTask) => {
    if (task.type === 'verification' && task.ownerId) {
      router.push(`/admin/owners?review=${task.ownerId}`);
    } else if (task.type === 'refund') {
      alert('Refund processing coming soon!');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">Approved</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">Completed</span>;
      case 'Pending':
        return <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">Pending</span>;
      case 'Review':
        return <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">Review</span>;
      case 'Log':
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">Log</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">{status}</span>;
    }
  };

  const getAvatarColor = (char: string) => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-yellow-500', 'bg-gray-500', 'bg-purple-500'];
    const index = char.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredActivities = activities.filter(activity =>
    activity.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-8 py-8">
        {/* Dashboard Overview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, Admin. Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <Link href="/admin/events/create">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors">
                  <Plus className="w-4 h-4" />
                  Create New Event
                </button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Event Owners</h3>
              <p className="text-3xl font-bold text-black mb-1">{stats.totalOwners}</p>
              <p className="text-sm text-green-600">+{stats.ownerChange}% <span className="text-gray-500">From last week</span></p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold text-black mb-1">{stats.pendingApprovals}</p>
              <p className="text-sm text-orange-600">Action Required <span className="text-gray-500">Review registrations</span></p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-black mb-1">{stats.totalEvents}</p>
              <p className="text-sm text-green-600">+{stats.eventChange}% <span className="text-gray-500">Across all categories</span></p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Attendees</h3>
              <p className="text-3xl font-bold text-black mb-1">{(stats.totalAttendees / 1000).toFixed(1)}k</p>
              <p className="text-sm text-green-600">+{stats.attendeeChange}% <span className="text-gray-500">Registered users</span></p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities - Left Side */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Recent Activities</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            {/* Activity Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">USER / ENTITY</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ACTION</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DATE</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No activities found
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.slice(0, 10).map((activity, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(activity.avatar)} flex items-center justify-center text-white font-semibold`}>
                              {activity.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">{activity.entity}</p>
                              <p className="text-xs text-gray-500">({activity.entityType})</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{activity.action}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{activity.date}</td>
                        <td className="py-3 px-4">{getStatusBadge(activity.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Link href="/admin/activities" className="text-sm text-black hover:underline">
                View all activity
              </Link>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link href="/admin/approvals" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-black">Review Registrations</p>
                    <p className="text-xs text-gray-500">{stats.pendingApprovals} pending items</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/admin/events" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-black">View All Events</p>
                    <p className="text-xs text-gray-500">Manage active listings</p>
                  </div>
                  <List className="w-5 h-5 text-black" />
                </Link>
                <Link href="/admin/analytics" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-black">System Analytics</p>
                    <p className="text-xs text-gray-500">Check platform health</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-black" />
                </Link>
              </div>
            </div>

            {/* Urgent Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">Urgent Tasks</h2>
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                  {urgentTasks.filter(t => t.priority === 'high').length} High Priority
                </span>
              </div>
              <div className="space-y-4">
                {urgentTasks.length === 0 ? (
                  <p className="text-sm text-gray-500">No urgent tasks</p>
                ) : (
                  urgentTasks.map((task, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-2">
                        {task.type === 'verification' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black">{task.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReviewTask(task)}
                        className="text-sm text-black hover:underline font-medium mt-2"
                      >
                        {task.action}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Platform Update Card */}
            <div className="bg-primary-green rounded-lg shadow-sm p-6 text-black">
              <h3 className="text-lg font-bold mb-2">Platform Update v2.4</h3>
              <p className="text-sm text-gray-800 mb-4">
                New analytics dashboard features are now live. Check out the improved reporting tools.
              </p>
              <button className="w-full bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Read Changelog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
