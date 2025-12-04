import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isScanning?: boolean;
  label?: string;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, isScanning = false, label = "Capture" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [streamActive, setStreamActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-xl border-2 border-dashed border-red-200 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => { setError(''); startCamera(); }}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          Retry Permission
        </button>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-slate-900/5 aspect-video w-full max-w-lg mx-auto">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${streamActive ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {!streamActive && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 border-4 border-indigo-500/50 rounded-2xl animate-pulse"></div>
          <div className="w-full h-1 bg-indigo-500 absolute top-0 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <button
          onClick={handleCapture}
          disabled={!streamActive || isScanning}
          className="bg-white/90 hover:bg-white text-slate-900 rounded-full p-4 shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          title={label}
        >
          <Camera className="w-8 h-8 text-indigo-600" />
        </button>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};