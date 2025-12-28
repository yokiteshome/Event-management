'use client';

import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ScanResult {
  valid: boolean;
  attendeeId?: string;
  eventId?: any;
  name?: string;
  email?: string;
}

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = async (decodedText: string) => {
    try {
      // Try new format: attendeeId|eventId (pipe-separated)
      let attendeeId: string | null = null;
      
      if (decodedText.includes('|')) {
        // New compact format
        const parts = decodedText.split('|');
        if (parts.length === 2) {
          attendeeId = parts[0];
        }
      } else {
        // Try old JSON format for backward compatibility
        try {
          const data = JSON.parse(decodedText);
          attendeeId = data.attendeeId;
        } catch {
          // If it's not JSON, treat the whole string as attendeeId
          attendeeId = decodedText;
        }
      }

      if (!attendeeId) {
        setScanResult({ valid: false });
        return;
      }

      // Fetch attendee details from API
      const res = await fetch(`/api/attendees/details?id=${attendeeId}`);
      if (res.ok) {
        const data = await res.json();
        const attendee = data.attendee;
        
        if (attendee && attendee.status === 'APPROVED') {
          setScanResult({
            valid: true,
            attendeeId: attendee._id,
            eventId: attendee.eventId,
            name: attendee.name,
            email: attendee.email
          });
        } else {
          setScanResult({ valid: false });
        }
      } else {
        setScanResult({ valid: false });
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({ valid: false });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">QR Code Scanner</h1>
            <p className="text-gray-600 dark:text-gray-300">Scan attendee QR codes for check-in</p>
          </div>

          {!scanResult ? (
            <div>
              <QRScanner onScan={handleScan} />
              
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  💡 <strong>Tip:</strong> Ensure the QR code is well-lit and centered in the camera view
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {scanResult.valid ? (
                <div className="animate-fade-in">
                  <div className="bg-primary-green/10 dark:bg-primary-green/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-primary-green" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-green dark:text-primary-green-light mb-6">
                    ✓ Valid QR Code
                  </h2>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-6 text-left">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Attendee Information</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Name:</strong> {scanResult.name}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Email:</strong> {scanResult.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Event:</strong> {typeof scanResult.eventId === 'object' ? scanResult.eventId?.name : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="bg-red-100 dark:bg-red-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6">
                    ✗ Invalid QR Code
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    This QR code is not valid or has been tampered with.
                  </p>
                </div>
              )}

              <Button onClick={resetScanner} className="mt-4">
                Scan Another QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
