// src/components/TestWebCapture.jsx
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Logo from '../assets/img/logo.png';

export default function TestWebCapture() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setLoading(true);
    // TODO: call getLocation() or upload imageSrc here
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(to right, #0d47a1, #1565c0, #1e88e5, #42a5f5)',
      }}
    >
      <div className="flex flex-col items-center gap-12 w-full max-w-md">
        {/* Logo */}
        <img
          src={Logo}
          alt="Company Logo"
          className="h-20 w-20 rounded-full border-2 border-white"
        />

        {/* Passport‑style webcam */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-72 h-96 rounded object-cover"
          />
        </div>

        {/* Capture button */}
        <button
          type="button"
          onClick={capture}
          disabled={loading}
          className={`
            w-1/2 border-2 rounded-[20px] 
            bg-[#FFA60D] border-[#F39A00] 
            shadow-[0_2px_3px_0_rgba(0,0,0,0.20),
                    inset_-5px_5px_6px_0_rgba(255,255,255,0.74)]
            font-medium py-2 text-white transition-colors
            hover:bg-[#FFC556]
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Processing…' : 'Capture Photo'}
        </button>
      </div>
    </div>
  );
}
