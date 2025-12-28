'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download,
  TrendingUp,
  MoreVertical,
  Zap,
  DollarSign,
  Building2,
  Calendar,
  Ticket
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface Metrics {
  totalRevenue: number;
  totalEvents: number;
  activeOrganizers: number;
  totalTicketsSold: number;
  revenueChange: number;
  eventsChange: number;
  organizersChange: number;
  ticketsChange: number;
}

interface RegistrationData {
  date: string;
  displayDate: string;
  registrations: number;
}

interface TicketDistribution {
  type: string;
  count: number;
  percentage: number;
}

interface OwnerGrowth {
  month: string;
  count: number;
}

interface Milestone {
  eventName: string;
  description: string;
  type: string;
  timeAgo: string;
}

interface AnalyticsData {
  metrics: Metrics;
  registrationsOverTime: RegistrationData[];
  ticketDistribution: TicketDistribution[];
  ownerGrowth: OwnerGrowth[];
  recentMilestones: Milestone[];
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        let periodParam = period;
        if (period === 'quarter') periodParam = 'quarter';
        else if (period === 'year') periodParam = 'year';
        
        const res = await fetch(`/api/admin/analytics?period=${periodParam}`);
        if (res.status === 403) {
          router.push('/auth/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await res.json();
        setData(analyticsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting report...');
  };

  if (loading) {
    return (
      <div className="pt-24 pb-8 px-8 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-24 pb-8 px-8 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  // Green theme colors
  const primaryGreen = '#3AA04B';
  const lightGreen = '#4FB35F';
  const veryLightGreen = '#ECFDF5';
  const green50 = '#F0FDF4';
  const green100 = '#DCFCE7';

  // Prepare chart data
  const pieData = data.ticketDistribution.map((item, index) => ({
    name: item.type,
    value: item.percentage,
    count: item.count
  }));

  const pieColors = [primaryGreen, lightGreen, '#A7F3D0'];

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'registrations':
        return <Zap className="w-5 h-5 text-primary-green" />;
      case 'revenue':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'organizer':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      default:
        return <Zap className="w-5 h-5 text-primary-green" />;
    }
  };

  // Sample registrations data for display (showing key dates)
  const displayRegistrations = data.registrationsOverTime.filter((_, index) => {
    const total = data.registrationsOverTime.length;
    // Show approximately 5-6 points
    return index % Math.ceil(total / 5) === 0 || index === total - 1;
  });

  return (
    <div className="pt-24 pb-8 px-8 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
            <p className="text-gray-600 text-lg">Overview of platform performance and growth metrics.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setPeriod('30')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === '30'
                    ? 'bg-primary-green text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setPeriod('quarter')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === 'quarter'
                    ? 'bg-primary-green text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                This Quarter
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === 'year'
                    ? 'bg-primary-green text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Year to Date
              </button>
            </div>
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="bg-primary-green hover:bg-primary-green-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.metrics.totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-green" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.metrics.revenueChange.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.metrics.totalEvents)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-green" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.metrics.eventsChange.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>

          {/* Active Organizers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Organizers</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.metrics.activeOrganizers)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-green" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.metrics.organizersChange.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>

          {/* Total Tickets Sold */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tickets Sold</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(data.metrics.totalTicketsSold)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary-green" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{data.metrics.ticketsChange.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registrations Over Time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Registrations Over Time</h3>
                <p className="text-sm text-gray-600">Daily ticket registrations across all events</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.registrationsOverTime}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryGreen} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={primaryGreen} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} Reg`, 'Registrations']}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke={primaryGreen}
                    strokeWidth={2}
                    fill="url(#colorRegistrations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ticket Sales Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ticket Sales Distribution</h3>
              <p className="text-sm text-gray-600">Breakdown by ticket type</p>
            </div>
            <div className="flex items-center gap-8 h-64">
              <div className="relative" style={{ width: '200px', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => {
                        const item = pieData.find(d => d.name === name);
                        return [`${value}%`, `${item?.count || 0} tickets`];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {data.metrics.totalTicketsSold >= 1000 
                        ? `${(data.metrics.totalTicketsSold / 1000).toFixed(1)}K`
                        : formatNumber(data.metrics.totalTicketsSold)
                      }
                    </p>
                    <p className="text-sm text-gray-600">Total Sales</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {data.ticketDistribution.map((item, index) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="text-sm text-gray-700">{item.type}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Owner Growth */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Event Owner Growth</h3>
              <p className="text-sm text-gray-600">New organizers joining per month</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ownerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill={primaryGreen} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Milestones */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Milestones</h3>
              <p className="text-sm text-gray-600">Key achievements across the platform</p>
            </div>
            <div className="space-y-4">
              {data.recentMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    {getMilestoneIcon(milestone.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{milestone.eventName}</p>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{milestone.timeAgo}</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-sm text-primary-green hover:text-primary-green-dark font-medium text-center pt-2">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
