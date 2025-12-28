'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  AlertTriangle,
  Mail, 
  Phone, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  X,
  Eye,
  Download
} from 'lucide-react';

interface Owner {
  _id: string;
  companyName: string;
  ownerFullName?: string;
  email: string;
  phoneNumber?: string;
  logoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  companyDocument?: string;
}

interface OwnerStats {
  totalOwners: number;
  pendingApproval: number;
  newThisMonth: number;
  totalChange: number;
  newThisMonthChange: number;
}

function AdminOwnersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [stats, setStats] = useState<OwnerStats>({
    totalOwners: 0,
    pendingApproval: 0,
    newThisMonth: 0,
    totalChange: 0,
    newThisMonthChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch('/api/admin/owners');
        if (res.status === 403) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        const allOwners = data.owners || [];
        setOwners(allOwners);
        setFilteredOwners(allOwners);

        // Calculate stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = allOwners.filter((o: Owner) => 
          new Date(o.createdAt) >= startOfMonth
        ).length;
        const pendingApproval = allOwners.filter((o: Owner) => o.status === 'PENDING').length;

        // Calculate percentage changes (mock for now, can be enhanced with historical data)
        const totalChange = 5;
        const newThisMonthChange = 12;

        setStats({
          totalOwners: allOwners.length,
          pendingApproval,
          newThisMonth,
          totalChange,
          newThisMonthChange
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching owners:', error);
        setLoading(false);
      }
    };

    fetchOwners();
  }, [router]);

  useEffect(() => {
    let filtered = owners;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(owner =>
        owner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.ownerFullName && owner.ownerFullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(owner => owner.status === statusFilter);
    }

    setFilteredOwners(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, owners]);

  const handleStatusChange = async (ownerId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/owners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, status }),
      });

      if (res.ok) {
        const data = await res.json();
        setOwners(owners.map(o => o._id === ownerId ? { ...o, status: data.owner.status } : o));
        // Update stats
        const pendingApproval = owners.filter(o => o.status === 'PENDING' && o._id !== ownerId).length;
        setStats(prev => ({ ...prev, pendingApproval }));
      }
    } catch (error) {
      console.error('Error updating owner status:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getOwnerId = (ownerId: string) => {
    // Generate a short ID from the MongoDB ObjectId
    const year = new Date().getFullYear();
    const shortId = ownerId.slice(-3).toUpperCase();
    return `#TN-${year}-${shortId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1.5 bg-primary-green text-white text-xs font-semibold rounded-full">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full">
            Rejected
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-semibold rounded-full">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOwners = filteredOwners.slice(startIndex, endIndex);

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
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Event Owners</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Owners</h1>
            <p className="text-gray-600 text-lg">Manage, review, and moderate registered event hosting companies.</p>
          </div>
          <button className="px-4 py-2.5 bg-primary-green hover:bg-primary-green-dark text-white rounded-lg transition-colors flex items-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            Add New Owner
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Owners */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Owners</h3>
              <TrendingUp className="w-5 h-5 text-primary-green" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalOwners.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-primary-green">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{stats.totalChange}%</span>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Pending Approval</h3>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingApproval}</p>
            <div className="flex items-center gap-1 text-orange-600">
              <span className="text-sm font-medium">Action Needed</span>
            </div>
          </div>

          {/* New This Month */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
              <TrendingUp className="w-5 h-5 text-primary-green" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.newThisMonth}</p>
            <div className="flex items-center gap-1 text-primary-green">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{stats.newThisMonthChange}%</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, name, or email..."
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
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-gray-700 bg-white cursor-pointer min-w-[140px]"
            >
              <option value="all">Status: All</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* More Filters Button */}
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    COMPANY
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    OWNER
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    REGISTRATION DATE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedOwners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      {searchQuery || statusFilter !== 'all' ? 'No matching results found' : 'No owners registered yet'}
                    </td>
                  </tr>
                ) : (
                  paginatedOwners.map((owner) => (
                    <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                            {owner.logoUrl ? (
                              <img 
                                src={owner.logoUrl} 
                                alt={owner.companyName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-primary-green">
                                {getInitials(owner.companyName)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{owner.companyName}</p>
                            <p className="text-xs text-gray-500 mt-1">{getOwnerId(owner._id)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {owner.ownerFullName || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Owner</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{owner.email}</span>
                          </div>
                          {owner.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{owner.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {formatDate(owner.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(owner.status)}
                          {owner.status === 'PENDING' ? (
                            <div className="flex items-center gap-2 ml-2">
                              {owner.companyDocument && (
                                <button
                                  onClick={() => {
                                    setSelectedOwner(owner);
                                    setShowDocumentModal(true);
                                  }}
                                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
                                  title="View Documents"
                                >
                                  <Eye className="w-4 h-4" />
                                  Docs
                                </button>
                              )}
                              <button
                                onClick={() => handleStatusChange(owner._id, 'APPROVED')}
                                className="px-3 py-1 text-primary-green hover:text-primary-green-dark text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(owner._id, 'REJECTED')}
                                className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 ml-2">
                              {owner.companyDocument && (
                                <button
                                  onClick={() => {
                                    setSelectedOwner(owner);
                                    setShowDocumentModal(true);
                                  }}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="View Documents"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </button>
                              )}
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredOwners.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredOwners.length)} of {filteredOwners.length} results
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

      {/* Document Viewing Modal */}
      {showDocumentModal && selectedOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Registration Documents</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOwner.companyName} - {selectedOwner.ownerFullName || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedOwner(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {selectedOwner.companyDocument ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-primary-green" />
                      <h3 className="font-semibold text-gray-900">Company Document</h3>
                    </div>
                    {selectedOwner.companyDocument.startsWith('data:') ? (
                      <div className="mt-4">
                        {selectedOwner.companyDocument.startsWith('data:image/') ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <img
                              src={selectedOwner.companyDocument}
                              alt="Company Document"
                              className="w-full h-auto max-h-[600px] object-contain"
                            />
                          </div>
                        ) : selectedOwner.companyDocument.startsWith('data:application/pdf') ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <iframe
                              src={selectedOwner.companyDocument}
                              className="w-full h-[600px]"
                              title="Company Document"
                            />
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <p className="text-gray-600 mb-4">Document preview not available for this file type.</p>
                            <a
                              href={selectedOwner.companyDocument}
                              download={`${selectedOwner.companyName}_document`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download Document
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <p className="text-gray-600 mb-4">Document path: {selectedOwner.companyDocument}</p>
                        <a
                          href={selectedOwner.companyDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded during registration.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedOwner(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOwnersPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-8 px-8 min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminOwnersContent />
    </Suspense>
  );
}
