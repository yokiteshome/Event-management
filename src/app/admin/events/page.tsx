'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Download, 
  Plus, 
  Calendar, 
  Building2,
  Eye, 
  Pencil, 
  Trash2,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface Event {
  _id: string;
  name: string;
  date: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  location: string;
  capacity: number;
  attendeeCount: number;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  ownerId: {
    companyName: string;
    logoUrl?: string;
  };
  createdAt: Date | string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hostCompanyFilter, setHostCompanyFilter] = useState('all');
  const [hostCompanies, setHostCompanies] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (hostCompanyFilter !== 'all') params.append('hostCompany', hostCompanyFilter);

        const res = await fetch(`/api/admin/events?${params.toString()}`);
        if (res.status === 403) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
        setHostCompanies(data.hostCompanies || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router, searchQuery, statusFilter, hostCompanyFilter]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getEventId = (eventId: string) => {
    // Generate a short ID from the MongoDB ObjectId
    return `#EV-${eventId.slice(-4).toUpperCase()}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span className="px-2.5 py-1 bg-primary-green/10 text-primary-green text-xs font-semibold rounded-md">
            Upcoming
          </span>
        );
      case 'Ongoing':
        return (
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
            Ongoing
          </span>
        );
      case 'Past':
        return (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
            Past
          </span>
        );
      default:
        return null;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEvents(new Set(filteredEvents.map(e => e._id)));
    } else {
      setSelectedEvents(new Set());
    }
  };

  const handleSelectEvent = (eventId: string, checked: boolean) => {
    const newSelected = new Set(selectedEvents);
    if (checked) {
      newSelected.add(eventId);
    } else {
      newSelected.delete(eventId);
    }
    setSelectedEvents(newSelected);
  };

  const handleExportData = () => {
    const headers = ['Event Title', 'Event ID', 'Host Company', 'Date', 'Status', 'Attendees'];
    const rows = filteredEvents.map(event => [
      event.name,
      getEventId(event._id),
      event.ownerId?.companyName || 'N/A',
      formatDate(event.date),
      event.status,
      event.attendeeCount.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    // TODO: Implement delete API call
    console.log('Delete event:', eventId);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="pt-24 pb-8 px-8 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-8 px-8 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Events Management</h1>
            <p className="text-gray-600 text-lg">Manage and oversee all events registered on the platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 border border-primary-green text-primary-green rounded-lg hover:bg-primary-green/5 transition-colors flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              className="px-4 py-2.5 bg-primary-green hover:bg-primary-green-dark text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event title, ID, or host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-gray-700 bg-white cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Past">Past</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
              <Calendar className="w-5 h-5" />
              Date Range
            </button>
          </div>

          {/* Host Company Filter */}
          <div className="relative">
            <select
              value={hostCompanyFilter}
              onChange={(e) => setHostCompanyFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-gray-700 bg-white cursor-pointer"
            >
              <option value="all">Host Company</option>
              {hostCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
            <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Grid3x3 className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 bg-primary-green/10 rounded transition-colors">
              <List className="w-5 h-5 text-primary-green" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedEvents.size === filteredEvents.length && filteredEvents.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    EVENT TITLE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    HOST COMPANY
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ATTENDEES
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedEvents.has(event._id)}
                          onChange={(e) => handleSelectEvent(event._id, e.target.checked)}
                          className="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{getEventId(event._id)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                            {event.ownerId?.logoUrl ? (
                              <img 
                                src={event.ownerId.logoUrl} 
                                alt={event.ownerId.companyName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-semibold text-primary-green">
                                {getInitials(event.ownerId?.companyName || 'N/A')}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-700">
                            {event.ownerId?.companyName || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {formatDate(event.date)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(event.status)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {event.attendeeCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredEvents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary-green text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 8 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-primary-green text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
