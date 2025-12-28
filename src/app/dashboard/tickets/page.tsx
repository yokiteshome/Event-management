'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket as TicketIcon, DollarSign, CheckCircle2, Search, ChevronDown } from 'lucide-react';

interface TicketStats {
  totalTicketsSold: number;
  totalRevenue: number;
  activeCheckIns: number;
  refunded: number;
}

interface TicketData {
  ticketRef: string;
  eventName: string;
  buyerName: string;
  buyerEmail: string;
  ticketType: string;
  price: number;
  dateSold: Date | string;
  status: string;
  checkedIn: boolean;
}

export default function TicketsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<TicketStats>({
    totalTicketsSold: 0,
    totalRevenue: 0,
    activeCheckIns: 0,
    refunded: 0
  });
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('any');
  const [events, setEvents] = useState<{ _id: string; name: string }[]>([]);

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

        // Fetch stats
        const statsRes = await fetch('/api/tickets/stats');
        if (statsRes.status === 403) {
          router.push('/auth/login');
          return;
        }
        const statsData = await statsRes.json();
        setStats(statsData.stats || stats);

        // Fetch tickets
        const ticketsRes = await fetch(
          `/api/tickets/list?event=${eventFilter}&status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`
        );
        if (ticketsRes.status === 403) {
          router.push('/auth/login');
          return;
        }
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData.tickets || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router, eventFilter, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">Paid</span>;
      case 'Pending':
        return <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">Pending</span>;
      case 'Refunded':
        return <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded">Refunded</span>;
      case 'Cancelled':
        return <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded">{status}</span>;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Tickets</h1>
          <p className="text-gray-600">Manage and track all tickets sold across your events.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="absolute top-4 right-4">
              <TicketIcon className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tickets Sold</h3>
            <p className="text-3xl font-bold text-black">{stats.totalTicketsSold.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="absolute top-4 right-4">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-black">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Check-ins</h3>
            <p className="text-3xl font-bold text-black">{stats.activeCheckIns.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Refunded</h3>
            <p className="text-3xl font-bold text-black">{stats.refunded}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ticket ref, buyer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-black cursor-pointer"
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
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="any">Any Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TICKET REF</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">EVENT NAME</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">BUYER INFO</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">TICKET TYPE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PRICE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DATE SOLD</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-black">{ticket.ticketRef}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{ticket.eventName}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div>
                          <p className="font-medium text-black">{ticket.buyerName}</p>
                          <p className="text-xs text-gray-500">{ticket.buyerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{ticket.ticketType}</td>
                      <td className="py-3 px-4 text-sm font-medium text-black">{formatCurrency(ticket.price)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatDate(ticket.dateSold)}</td>
                      <td className="py-3 px-4">{getStatusBadge(ticket.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Summary */}
          {tickets.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing 1 to {tickets.length} of {stats.totalTicketsSold} results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

