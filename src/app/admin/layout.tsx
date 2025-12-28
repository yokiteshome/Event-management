'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
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
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
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
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="EventAdmin Logo" 
                width={40} 
                height={40} 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-black">EventAdmin</span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') && pathname === '/admin'
                    ? 'text-black font-semibold border-b-2 border-primary-green pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/owners"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/owners')
                    ? 'text-black font-semibold border-b-2 border-primary-green pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Event Owners
              </Link>
              <Link
                href="/admin/events"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/events')
                    ? 'text-black font-semibold border-b-2 border-primary-green pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Events
              </Link>
              <Link
                href="/admin/approvals"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/approvals')
                    ? 'text-black font-semibold border-b-2 border-primary-green pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Approvals
              </Link>
              <Link
                href="/admin/analytics"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/analytics')
                    ? 'text-black font-semibold border-b-2 border-primary-green pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Analytics
              </Link>
            </div>

            {/* Right: Search, Notifications, User */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-black transition-colors">
                <Search className="w-5 h-5" />
              </button>
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
              <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">
                      {userData?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData?.role === 'ADMIN' ? 'Super Admin' : userData?.companyName || 'Admin'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
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
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-black">{userData?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {userData?.role === 'ADMIN' ? 'Super Admin' : userData?.companyName || 'Admin'}
                      </p>
                    </div>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
}

