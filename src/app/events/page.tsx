'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Event {
  _id: string;
  name: string;
  description?: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  location: string;
  capacity: number;
  bannerImage?: string;
  ownerId: {
    companyName: string;
    logoUrl?: string;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [categoryFilter, setCategoryFilter] = useState('Category');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (dateFilter !== 'All Dates') params.append('date', dateFilter);
        if (locationFilter !== 'All Locations') params.append('location', locationFilter);
        if (categoryFilter !== 'Category') params.append('category', categoryFilter);

        const res = await fetch(`/api/events/public?${params.toString()}`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery, dateFilter, locationFilter, categoryFilter]);

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

  const getPrice = (event: Event) => {
    // For now, we'll use a placeholder. You can add a price field to the Event model later
    // This is a simple example - you might want to add pricing logic
    return 'Free';
  };

  const displayedEvents = events.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-3">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600">
            Discover workshops, conferences, and meetups happening around you or online.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title, venue, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-[#1E293B]"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
                >
                  <option>All Dates</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Next Month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
                >
                  <option>All Locations</option>
                  <option>Online Event</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>London</option>
                  <option>Berlin</option>
                  <option>Boston</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent cursor-pointer"
                >
                  <option>Category</option>
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Design</option>
                  <option>Healthcare</option>
                  <option>Networking</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-gray-600">Loading events...</div>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No events found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedEvents.map((event) => (
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
                    {/* Date Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                      <span className="text-sm font-bold text-[#1E293B]">
                        {formatDate(event.date)}
                      </span>
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

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#1E293B]">
                        {getPrice(event)}
                      </span>
                    </div>

                    <Link href={`/events/${event._id}/register`}>
                      <Button className="w-full bg-primary-green hover:bg-primary-green-dark text-white">
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {events.length > displayCount && (
              <div className="text-center">
                <Button
                  onClick={() => setDisplayCount(displayCount + 6)}
                  className="bg-white text-[#1E293B] hover:bg-gray-50 border-2 border-gray-300 px-8 py-3 flex items-center gap-2 mx-auto"
                >
                  Load More Events
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

