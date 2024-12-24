import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 96 }: QRCodeDisplayProps) {
  return (
    <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-sm">
      <QRCodeSVG 
        value={value} 
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}