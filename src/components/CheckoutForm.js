"use client";

import React, { useState, useEffect } from 'react';

export default function CheckoutForm({ seatId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSuccess(seatId);
    }, 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/85 backdrop-blur-2xl w-full max-w-md rounded-[30px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-10 transform animate-in zoom-in-95 duration-500">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[32px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] leading-[1.0] mb-2 tracking-tight">Checkout.</h2>
            <p className="text-[13px] text-[var(--color-carbon-text)] font-light tracking-wide">Acquiring Block No. {seatId}</p>
          </div>
          <div className="bg-black/5 border border-black/10 rounded-[12px] px-4 py-2 text-right">
            <p className="text-[9px] text-[var(--color-fog)] uppercase tracking-widest font-bold mb-1">Time Remaining</p>
            <p className="text-[18px] text-[var(--color-midnight-ink)] font-mono font-medium">{minutes}:{seconds.toString().padStart(2, '0')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-midnight-ink)] uppercase tracking-[0.2em] mb-2 ml-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/50 border border-gray-200 rounded-[16px] py-[12px] px-[16px] text-[var(--color-carbon-text)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-midnight-ink)] focus:bg-white transition-all shadow-inner"
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-midnight-ink)] uppercase tracking-[0.2em] mb-2 ml-2">Card Information</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/50 border border-gray-200 rounded-[16px] py-[12px] px-[16px] text-[var(--color-carbon-text)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-midnight-ink)] focus:bg-white transition-all shadow-inner"
                placeholder="0000 0000 0000 0000"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-1/3 bg-transparent text-[var(--color-midnight-ink)] font-medium text-[14px] py-[14px] hover:text-black hover:bg-black/5 rounded-[20px] disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[var(--color-midnight-ink)] text-white font-medium text-[15px] py-[14px] rounded-[20px] hover:bg-black hover:scale-[1.02] disabled:opacity-50 transition-all flex justify-center items-center shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Complete Transaction"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
