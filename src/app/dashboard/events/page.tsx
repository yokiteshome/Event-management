'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Plus, Users, Share2, Settings, MapPin, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location: string;
  capacity: number;
  bannerImage?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[d.getMonth()] + ' ' + d.getDate().toString().padStart(2, '0');
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getTimeRange = (event: Event) => {
    if (event.startDate && event.endDate) {
      return `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
    }
    if (event.startDate) {
      return `${formatTime(event.startDate)}`;
    }
    return 'TBA';
  };

  const handleShare = async (event: Event) => {
    const eventUrl = `${window.location.origin}/events/${event._id}/register`;
    const shareText = `Check out this event: ${event.name}`;

    // Try Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: shareText,
          url: eventUrl,
        });
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to clipboard
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopiedEventId(event._id);
      setTimeout(() => setCopiedEventId(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = eventUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedEventId(event._id);
        setTimeout(() => setCopiedEventId(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events/list');
      if (res.status === 403) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
    };

    fetchEvents();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Events</h1>
            <p className="text-gray-600">Manage all your events</p>
          </div>

          <Link href="/dashboard/events/create">
            <Button size="lg" className="flex items-center gap-2 bg-primary-green hover:bg-primary-green-dark">
              <Plus className="w-5 h-5" />
              Create Event
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
              <p className="text-gray-500 mb-6">Create your first event to get started!</p>
              <Link href="/dashboard/events/create">
                <Button className="bg-primary-green hover:bg-primary-green-dark">Create Event</Button>
              </Link>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Event Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-green/20 to-primary-green/40">
                  {event.bannerImage ? (
                    <Image
                      src={event.bannerImage}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-primary-green/50" />
                    </div>
                  )}
                  {/* Settings Button (replaces date badge) */}
                  <div className="absolute top-4 right-4">
                    <Link href={`/dashboard/events/${event._id}/manage`}>
                      <Button
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5"
                        title="Manage event"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1E293B] mb-3 line-clamp-2">
                    {event.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{getTimeRange(event)}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description || 'Join us for an exciting event!'}
                  </p>

                  {/* Manage Attendees and Share Buttons */}
                  <div className="flex gap-2">
                    <Link href="/dashboard/attendees" className="flex-1">
                      <Button className="w-full flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green-dark text-white">
                        <Users className="w-4 h-4" />
                        Manage Attendees
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleShare(event)}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      title="Share event"
                    >
                      <Share2 className="w-4 h-4" />
                      {copiedEventId === event._id ? 'Copied!' : 'Share'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

