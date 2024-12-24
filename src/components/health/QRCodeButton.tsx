import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRScanner from './QRScanner';
import { useNavigate } from 'react-router-dom';

export default function QRCodeButton() {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleScan = (data: string) => {
    setIsScanning(false);
    const recordId = data.split('/').pop();
    if (recordId) {
      navigate(`/health-records/${recordId}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsScanning(true)}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
      >
        <QrCode className="h-4 w-4 mr-2" />
        Scanner un QR code
      </button>

      {isScanning && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setIsScanning(false)}
        />
      )}
    </>
  );
}