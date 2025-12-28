'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Button from './ui/Button';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Error callback - can be ignored for most cases
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      alert('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div id="qr-reader" className="w-full max-w-md mx-auto rounded-lg overflow-hidden"></div>
      
      <div className="flex gap-3 justify-center">
        {!isScanning ? (
          <Button onClick={startScanning} variant="primary">
            Start Scanner
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="danger">
            Stop Scanner
          </Button>
        )}
      </div>
    </div>
  );
}
