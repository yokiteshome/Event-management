'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRBox from '@/components/QRBox';
import { QrCode, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  status: string;
  eventId: {
    name: string;
    date: string;
    location: string;
    ownerId: {
      companyName: string;
      logoUrl?: string;
    };
  };
}

export default function QRCodePage() {
  const params = useParams();
  const attendeeId = params?.attendeeId as string;
  
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendee = async () => {
      const res = await fetch(`/api/attendees/details?id=${attendeeId}`);
      if (res.ok) {
        const data = await res.json();
        setAttendee(data.attendee);
      }
      setLoading(false);
    };

    if (attendeeId) {
      fetchAttendee();
    }
  }, [attendeeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!attendee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Registration Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This QR code link is invalid or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // QR Data: Only include essential IDs to keep it short
  // Format: attendeeId|eventId (pipe-separated for compactness)
  const qrData = `${attendee._id}|${typeof attendee.eventId === 'object' ? attendee.eventId._id : attendee.eventId}`;

  if (attendee.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pending Approval</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your registration is awaiting approval from the event organizer.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Event:</strong> {attendee.eventId.name}<br />
              <strong>Name:</strong> {attendee.name}<br />
              <strong>Email:</strong> {attendee.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (attendee.status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center px-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Registration Rejected</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unfortunately, your registration for this event was not approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Registration Approved!</h1>
            <p className="text-gray-600 dark:text-gray-300">Present this QR code at the event entrance</p>
          </div>

          {/* Event Details */}
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{attendee.eventId.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>📅 Date:</strong> {new Date(attendee.eventId.date).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>📍 Location:</strong> {attendee.eventId.location}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>👤 Attendee:</strong> {attendee.name}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <QRBox data={qrData} size={280} />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Save this page or take a screenshot for easy access at the event.
            </p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>⚠️ Important:</strong> This QR code is unique to you. Do not share it with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
