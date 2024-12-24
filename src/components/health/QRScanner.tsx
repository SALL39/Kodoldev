import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrame: number;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          onScan(code.data);
          return;
        }
      }
      animationFrame = requestAnimationFrame(scan);
    };

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        scan();
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Camera className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium">Scanner un QR code</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          <div className="absolute inset-0 border-2 border-yellow-500 opacity-50" />
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Placez le QR code dans le cadre pour le scanner
        </p>
      </div>
    </div>
  );
}