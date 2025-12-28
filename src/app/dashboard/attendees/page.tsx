'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, UserPlus, Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, X, Calendar, User, CheckSquare, ChevronRight as ChevronRightIcon } from 'lucide-react';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  eventName: string;
  ticketType: string;
  registrationDate: Date | string;
  status: string;
  checkedIn: boolean;
  attendeeStatus: string;
}

export default function AttendeesPage() {
  const router = useRouter();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [events, setEvents] = useState<{ _id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventId: '', ticketType: '', notes: '', sendEmail: false });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ _id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events for filter
        const eventsRes = await fetch('/api/events/list');
        if (eventsRes.status === 403) {
          router.push('/auth/login');
          return;
        }
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);

        // Fetch attendees
        const attendeesRes = await fetch(
          `/api/attendees/all?event=${eventFilter}&status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`
        );
        if (attendeesRes.status === 403) {
          router.push('/auth/login');
          return;
        }
        const attendeesData = await attendeesRes.json();
        setAttendees(attendeesData.attendees || []);
        setCurrentPage(1); // Reset to first page when filters change
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router, eventFilter, statusFilter, searchQuery]);

  const handleCheckIn = async (attendeeId: string) => {
    try {
      const res = await fetch('/api/attendees/checkin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId }),
      });

      if (res.ok) {
        // Refresh attendees
        const attendeesRes = await fetch(
          `/api/attendees/all?event=${eventFilter}&status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`
        );
        const attendeesData = await attendeesRes.json();
        setAttendees(attendeesData.attendees || []);
      }
    } catch (error) {
      console.error('Error checking in attendee:', error);
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting attendees...');
    alert('Export functionality coming soon!');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/attendees/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventId: formData.eventId,
          phone: formData.phone,
          notes: formData.notes,
          sendEmail: formData.sendEmail
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setFormSuccess('Attendee registered successfully!');
      setFormData({ name: '', email: '', phone: '', eventId: '', ticketType: '', notes: '', sendEmail: false });
      setSelectedEvent(null);
      
      // Refresh attendees list
      const attendeesRes = await fetch(
        `/api/attendees/all?event=${eventFilter}&status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`
      );
      if (attendeesRes.ok) {
        const attendeesData = await attendeesRes.json();
        setAttendees(attendeesData.attendees || []);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowRegisterModal(false);
        setFormSuccess('');
      }, 2000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowRegisterModal(true);
    setFormError('');
    setFormSuccess('');
    const defaultEvent = events.length > 0 ? events[0] : null;
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      eventId: defaultEvent?._id || '', 
      ticketType: 'General Admission - $50.00',
      notes: '',
      sendEmail: false
    });
    setSelectedEvent(defaultEvent);
  };

  const handleEventChange = (eventId: string) => {
    setFormData({ ...formData, eventId });
    const event = events.find(e => e._id === eventId);
    setSelectedEvent(event || null);
  };

  const ticketTypes = [
    'General Admission - $50.00',
    'VIP All Access - $499.00',
    'Early Bird - $89.00',
    'Standard Pass - $150.00',
    'Student Pass - $50.00',
    'Exhibitor - $800.00'
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Checked in':
        return { text: 'Checked in', dotColor: 'bg-green-500' };
      case 'Registered':
        return { text: 'Registered', dotColor: 'bg-primary-green' };
      case 'Cancelled':
        return { text: 'Cancelled', dotColor: 'bg-gray-400' };
      case 'Pending':
        return { text: 'Pending', dotColor: 'bg-yellow-500' };
      default:
        return { text: status, dotColor: 'bg-gray-400' };
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Pagination
  const totalPages = Math.ceil(attendees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttendees = attendees.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Attendees</h1>
            <p className="text-gray-600">Manage registration and check-ins for all your events.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register Attendee
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-green cursor-pointer"
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>{event.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary-green cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="checked-in">Checked in</option>
                  <option value="registered">Registered</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ATTENDEE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">EVENT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">REGISTRATION DATE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No attendees found
                    </td>
                  </tr>
                ) : (
                  paginatedAttendees.map((attendee) => {
                    const statusDisplay = getStatusDisplay(attendee.status);
                    return (
                      <tr key={attendee._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(attendee.name)} flex items-center justify-center text-white font-semibold`}>
                              {getInitials(attendee.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">{attendee.name}</p>
                              <p className="text-xs text-gray-500">{attendee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-black">{attendee.eventName}</p>
                            <p className="text-xs text-gray-500">{attendee.ticketType}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{formatDate(attendee.registrationDate)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusDisplay.dotColor}`}></div>
                            <span className="text-sm text-gray-700">{statusDisplay.text}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {!attendee.checkedIn && attendee.attendeeStatus === 'APPROVED' && (
                              <button
                                onClick={() => handleCheckIn(attendee._id)}
                                className="px-3 py-1 text-sm bg-primary-green text-white rounded hover:bg-primary-green-dark transition-colors"
                              >
                                Check in
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {attendees.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, attendees.length)} of {attendees.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 10) {
                    pageNum = i + 1;
                  } else if (currentPage <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 4) {
                    pageNum = totalPages - 9 + i;
                  } else {
                    pageNum = currentPage - 4 + i;
                  }
                  
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-primary-green text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 10 && currentPage < totalPages - 4 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Register Attendee Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Breadcrumbs */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <a href="/dashboard" className="hover:text-black">Dashboard</a>
                <ChevronRightIcon className="w-4 h-4" />
                <a href="/dashboard/events" className="hover:text-black">Events</a>
                {selectedEvent && (
                  <>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-black">{selectedEvent.name}</span>
                  </>
                )}
                <ChevronRightIcon className="w-4 h-4" />
                <span className="text-black">Register Attendee</span>
              </div>
            </div>

            <div className="p-8">
              {/* Title and Description */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-2">Register New Attendee</h2>
                <p className="text-gray-600">
                  Manually add a participant to an existing event. They will receive an email confirmation instantly.
                </p>
              </div>

              {formError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                {/* Event Details Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Event Details</h3>
                  </div>
                  <div>
                    <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Event
                    </label>
                    <div className="relative">
                      <select
                        id="eventId"
                        required
                        value={formData.eventId}
                        onChange={(e) => handleEventChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green transition-colors appearance-none bg-white pr-10"
                      >
                        <option value="">Select an event</option>
                        {events.map(event => (
                          <option key={event._id} value={event._id}>{event.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {events.length === 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        No events available. <a href="/dashboard/events/create" className="text-black hover:underline">Create an event first</a>.
                      </p>
                    )}
                  </div>
                </div>

                {/* Attendee Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Attendee Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. jane@company.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-gray-400 font-normal">OPTIONAL</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 (555) 000-0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Type
                      </label>
                      <div className="relative">
                        <select
                          id="ticketType"
                          value={formData.ticketType}
                          onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green transition-colors appearance-none bg-white pr-10"
                        >
                          {ticketTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Additional Details</h3>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Restrictions & Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Please list any allergies or special requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Send Email Option */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    id="sendEmail"
                    type="checkbox"
                    checked={formData.sendEmail}
                    onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                    className="mt-1 w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                  />
                  <div>
                    <label htmlFor="sendEmail" className="block text-sm font-medium text-black cursor-pointer">
                      Send invitation email immediately
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      The attendee will receive their ticket and QR code right away.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegisterModal(false);
                      setFormError('');
                      setFormSuccess('');
                      setFormData({ name: '', email: '', phone: '', eventId: '', ticketType: 'General Admission - $50.00', notes: '', sendEmail: false });
                      setSelectedEvent(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || events.length === 0}
                    className="flex-1 px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    {formLoading ? 'Registering...' : 'Register Attendee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

