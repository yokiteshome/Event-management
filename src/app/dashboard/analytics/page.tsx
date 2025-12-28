'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Ticket, 
  Eye, 
  ShoppingCart, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Metrics {
  totalRevenue: number;
  ticketsSold: number;
  pageViews: number;
  conversionRate: number;
  revenueChange: number;
  ticketsChange: number;
  pageViewsChange: number;
  conversionChange: number;
}

interface SalesTrend {
  day: string;
  sales: number;
}

interface Demographics {
  ageRange: string;
  percentage: number;
}

interface RegistrationSource {
  source: string;
  visitors: number;
  registrations: number;
  conversionRate: number;
}

interface TicketType {
  type: string;
  percentage: number;
  count: number;
}

interface AnalyticsData {
  metrics: Metrics;
  salesTrend: SalesTrend[];
  demographics: Demographics[];
  registrationSources: RegistrationSource[];
  ticketTypes: TicketType[];
  totalTickets: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/overview?period=${period}`);
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
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleExport = () => {
    // Export functionality - can be implemented later
    console.log('Exporting report...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  // Colors for charts - using green/light green instead of blue
  const barColors = ['#4FB35F', '#4FB35F', '#4FB35F', '#4FB35F', '#4FB35F', '#4FB35F', '#3AA04B'];
  const pieColors = ['#3AA04B', '#8B5CF6', '#4FB35F']; // General (green), VIP (purple), Early Bird (light green)
  const demographicColors = ['#3AA04B', '#4FB35F', '#2E7D3A', '#047155'];

  // Prepare pie chart data
  const pieData = data.ticketTypes.map((type, index) => ({
    name: type.type,
    value: type.percentage,
    color: pieColors[index % pieColors.length]
  }));

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <Calendar className="w-4 h-4 text-gray-600" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border-none outline-none text-sm text-gray-700 bg-transparent"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-green" />
              </div>
              {data.metrics.revenueChange >= 0 ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.revenueChange).toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.revenueChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.metrics.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          {/* Tickets Sold */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary-green" />
              </div>
              {data.metrics.ticketsChange >= 0 ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.ticketsChange).toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.ticketsChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tickets Sold</h3>
            <p className="text-2xl font-bold text-gray-900">{data.metrics.ticketsSold.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          {/* Page Views */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              {data.metrics.pageViewsChange >= 0 ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.pageViewsChange).toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.pageViewsChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Page Views</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.metrics.pageViews)}</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              {data.metrics.conversionChange >= 0 ? (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.conversionChange).toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">~{Math.abs(data.metrics.conversionChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{data.metrics.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Sales Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ticket Sales Trend</h2>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 text-gray-700"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="#4FB35F" radius={[8, 8, 0, 0]}>
                  {data.salesTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendee Demographics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendee Demographics</h2>
            <div className="space-y-4">
              {data.demographics.map((demo, index) => (
                <div key={demo.ageRange}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Age {demo.ageRange}</span>
                    <span className="text-sm font-semibold text-gray-900">{demo.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${demo.percentage}%`,
                        backgroundColor: demographicColors[index % demographicColors.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Registration Sources</h2>
              <button className="text-sm text-primary-green hover:underline font-medium">
                View Full Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">SOURCE</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">VISITORS</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">REGISTRATIONS</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">CONV. RATE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.registrationSources.map((source, index) => (
                    <tr key={source.source} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-700 font-medium">{source.source}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{source.visitors.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{source.registrations.toLocaleString()}</td>
                      <td className={`py-3 px-4 text-sm font-semibold ${
                        source.conversionRate >= 10 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {source.conversionRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ticket Types Sold */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ticket Types Sold</h2>
            <div className="relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">{formatNumber(data.totalTickets)}</span>
                <span className="text-sm text-gray-600">Total</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {data.ticketTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="text-sm text-gray-700">{type.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
