'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, ChevronLeft, ChevronRight, FileText, X, Eye } from 'lucide-react';

interface Owner {
  _id: string;
  companyName: string;
  ownerFullName?: string;
  email: string;
  status: string;
  createdAt: string;
  companyDocument?: string;
}

export default function AdminApprovalsPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
        // Filter only pending owners
        const pendingOwners = (data.owners || []).filter((o: Owner) => o.status === 'PENDING');
        setOwners(pendingOwners);
        setFilteredOwners(pendingOwners);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching owners:', error);
        setLoading(false);
      }
    };

    fetchOwners();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOwners(owners);
      setCurrentPage(1);
    } else {
      const filtered = owners.filter(owner =>
        owner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (owner.ownerFullName && owner.ownerFullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOwners(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, owners]);

  const handleStatusChange = async (ownerId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/owners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, status }),
      });

      if (res.ok) {
        // Remove the owner from the list after approval/rejection
        setOwners(owners.filter(o => o._id !== ownerId));
        setFilteredOwners(filteredOwners.filter(o => o._id !== ownerId));
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleExportCSV = () => {
    const headers = ['Company Name', 'Owner Name', 'Email', 'Registration Date', 'Status'];
    const rows = filteredOwners.map(owner => [
      owner.companyName,
      owner.ownerFullName || 'N/A',
      owner.email,
      formatDate(owner.createdAt),
      owner.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-approvals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
          <p className="text-gray-600 text-lg mb-6">
            {filteredOwners.length} new registration request{filteredOwners.length !== 1 ? 's' : ''} require your attention
          </p>

          {/* Search and Actions Bar */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company or owner name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              />
            </div>

            {/* Filters Button */}
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-3 bg-primary-green hover:bg-primary-green-dark text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    COMPANY NAME
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    OWNER NAME
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    REGISTRATION DATE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedOwners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      {searchQuery ? 'No matching results found' : 'No pending approvals'}
                    </td>
                  </tr>
                ) : (
                  paginatedOwners.map((owner) => (
                    <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-sm font-medium text-gray-900">Pending</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-green">
                              {getInitials(owner.companyName)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{owner.companyName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {owner.ownerFullName || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {formatDate(owner.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {owner.companyDocument && (
                            <button
                              onClick={() => {
                                setSelectedOwner(owner);
                                setShowDocumentModal(true);
                              }}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
                              title="View Documents"
                            >
                              <Eye className="w-4 h-4" />
                              View Docs
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(owner._id, 'APPROVED')}
                            className="px-3 py-1.5 bg-primary-green hover:bg-primary-green-dark text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(owner._id, 'REJECTED')}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Reject
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
          {filteredOwners.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredOwners.length)} of {filteredOwners.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
