'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Users, 
  BarChart3,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface UserData {
  id: string;
  email: string;
  role: string;
  name: string;
  fullName?: string;
  companyName?: string;
  phoneNumber?: string;
  logoUrl?: string;
  status?: string;
}

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    ownerId?: string;
    eventId?: string;
    attendeeId?: string;
    [key: string]: any;
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else if (res.status === 401) {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setNotificationCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchUserData();
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true })
      });
      
      if (res.ok) {
        setNotificationCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Section */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="EventPlatform Logo" 
                width={48} 
                height={48} 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">EventPlatform</h1>
                <p className="text-xs text-gray-500">SaaS Platform</p>
              </div>
            </div>
            <div className="relative" ref={notificationDropdownRef}>
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative p-2 text-gray-600 hover:text-black transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-black">Notifications</h3>
                    {notificationCount > 0 && (
                      <span className="text-xs text-gray-500">{notificationCount} new</span>
                    )}
                  </div>
                  <div className="py-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification._id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-black">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                  {notificationCount > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="w-full text-xs text-primary-green hover:text-primary-green-dark font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard') && pathname === '/dashboard'
                  ? 'bg-primary-green/10 text-black border-l-4 border-primary-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') && pathname === '/dashboard' ? 'text-primary-green' : 'text-gray-600'}`} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/events"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard/events')
                  ? 'bg-primary-green/10 text-black border-l-4 border-primary-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className={`w-5 h-5 ${isActive('/dashboard/events') ? 'text-primary-green' : 'text-gray-600'}`} />
              <span className="font-medium">Events</span>
            </Link>

            <Link
              href="/dashboard/tickets"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard/tickets')
                  ? 'bg-primary-green/10 text-black border-l-4 border-primary-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Ticket className={`w-5 h-5 ${isActive('/dashboard/tickets') ? 'text-primary-green' : 'text-gray-600'}`} />
              <span className="font-medium">Tickets</span>
            </Link>

            <Link
              href="/dashboard/attendees"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard/attendees')
                  ? 'bg-primary-green/10 text-black border-l-4 border-primary-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className={`w-5 h-5 ${isActive('/dashboard/attendees') ? 'text-primary-green' : 'text-gray-600'}`} />
              <span className="font-medium">Attendees</span>
            </Link>

            <Link
              href="/dashboard/analytics"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard/analytics')
                  ? 'bg-primary-green/10 text-black border-l-4 border-primary-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className={`w-5 h-5 ${isActive('/dashboard/analytics') ? 'text-primary-green' : 'text-gray-600'}`} />
              <span className="font-medium">Analytics</span>
            </Link>
          </nav>
        </div>

        {/* Profile and Logout at Bottom */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* User Profile Info */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
              {userData?.logoUrl ? (
                <Image
                  src={userData.logoUrl}
                  alt={userData.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email || ''}
              </p>
              {userData?.companyName && (
                <p className="text-xs text-gray-400 truncate">
                  {userData.companyName}
                </p>
              )}
            </div>
          </Link>

          {/* Profile and Logout Actions */}
          <div className="space-y-1">
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-primary-green/10 text-black font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-white">
        {children}
      </main>
    </div>
  );
}

