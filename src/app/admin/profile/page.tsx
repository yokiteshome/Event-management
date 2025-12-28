'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Shield, CheckCircle, Edit2 } from 'lucide-react';
import Button from '@/components/ui/Button';

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

export default function AdminProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your admin account information and settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
              {userData.logoUrl ? (
                <Image
                  src={userData.logoUrl}
                  alt={userData.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Super Admin</span>
                </div>
              </div>
              <p className="text-gray-600 mb-1">Administrator Account</p>
              {userData.companyName && (
                <p className="text-sm text-gray-500">{userData.companyName}</p>
              )}
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => {/* TODO: Implement edit functionality */}}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-base text-gray-900">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
                <p className="text-base text-gray-900">Super Admin</p>
              </div>
            </div>

            {userData.companyName && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Organization</p>
                  <p className="text-base text-gray-900">{userData.companyName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {/* TODO: Implement change password */}}
            >
              Change Password
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {/* TODO: Implement account settings */}}
            >
              Account Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

