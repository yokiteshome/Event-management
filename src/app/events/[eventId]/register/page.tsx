'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location: string;
  ownerId: {
    _id: string;
    companyName: string;
    logoUrl?: string;
  };
}

export default function AttendeeRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendeeId, setAttendeeId] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to load event details');
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/attendees/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          notes: formData.notes || undefined,
          eventId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setAttendeeId(data.attendeeId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex border border-black">
        <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
          <Image 
            src="/login.register.jpg" 
            alt="Event Platform" 
            fill
            className="object-cover"
            priority
          />
          {/* Logo overlay */}
          <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
            <Image 
              src="/logo.png" 
              alt="EventPlatform Logo" 
              width={48} 
              height={48} 
              className="h-12 w-auto"
            />
            <span className="text-white text-xl font-semibold">EventPlatform</span>
          </div>
        </div>
        <div className="w-full lg:w-[55%] bg-white flex items-center justify-center px-6">
          <div className="bg-white p-8 text-center max-w-md">
            <div className="bg-primary-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your registration is pending approval by the event organizer. 
              You'll receive your QR code once approved.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Save this link to check your QR code later:
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
              <code className="text-sm text-primary-green break-all">
                {typeof window !== 'undefined' && `${window.location.origin}/qr/${attendeeId}`}
              </code>
            </div>
            <button
              onClick={() => router.push(`/qr/${attendeeId}`)}
              className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View QR Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">
          {error || 'Loading event...'}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-white flex border border-black">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <Image 
          src="/login.register.jpg" 
          alt="Event Platform" 
          fill
          className="object-cover"
          priority
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <Image 
            src="/logo.png" 
            alt="EventPlatform Logo" 
            width={48} 
            height={48} 
            className="h-12 w-auto"
          />
          <span className="text-white text-xl font-semibold">EventPlatform</span>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Register for Event</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={event.name}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="text"
                  id="eventDate"
                  value={formatDate(event.date)}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              {event.startDate && event.endDate && (
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="text"
                    id="eventTime"
                    value={`${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              )}

              <div>
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  value={event.location}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="eventOrganizer" className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer
                </label>
                <input
                  type="text"
                  id="eventOrganizer"
                  value={event.ownerId.companyName}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  placeholder="Any special requirements or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-green focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            </form>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Your registration will be reviewed by the event organizer. Approval will be sent via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
