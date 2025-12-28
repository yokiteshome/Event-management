'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRBoxProps {
  data: string;
  size?: number;
}

export default function QRBox({ data, size = 256 }: QRBoxProps) {
  // Determine error correction level based on data length
  // Level H (High) can handle less data, so we'll use M (Medium) for longer data
  // Level M can handle ~2953 characters, which should be more than enough for our compact format
  const getErrorCorrectionLevel = (dataLength: number): 'L' | 'M' | 'Q' | 'H' => {
    if (dataLength > 2000) return 'L'; // Low - most capacity
    if (dataLength > 1500) return 'M'; // Medium
    if (dataLength > 1000) return 'Q'; // Quartile
    return 'H'; // High - best error correction, least capacity
  };

  const errorLevel = getErrorCorrectionLevel(data.length);

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border-4 border-indigo-500 inline-block">
      <QRCodeSVG 
        value={data} 
        size={size}
        level={errorLevel}
        includeMargin={true}
      />
    </div>
  );
}
