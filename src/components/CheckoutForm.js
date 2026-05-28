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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-midnight-ink)]/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-canvas-white)] w-full max-w-md rounded-[8px] border border-[var(--color-midnight-ink)] shadow-2xl p-8 transform animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-[34px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] leading-[1.0] mb-2">Checkout</h2>
            <p className="text-[14px] text-[var(--color-fog)]">Acquiring Piece No. {seatId}</p>
          </div>
          <div className="bg-[var(--color-warm-linen)] border border-[var(--color-steel-gaze)] rounded-[3.4px] px-3 py-1 text-right">
            <p className="text-[10px] text-[var(--color-fog)] uppercase tracking-widest font-bold">Lock Expires</p>
            <p className="text-[17px] text-[var(--color-midnight-ink)] font-mono">{minutes}:{seconds.toString().padStart(2, '0')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-midnight-ink)] uppercase tracking-widest mb-2 ml-4">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-[rgba(0,0,0,0.05)] border border-[var(--color-midnight-ink)] rounded-[100px_0_0_100px] py-[8px] pl-[20px] text-[var(--color-carbon-text)] text-[14px] focus:outline-none focus:bg-[var(--color-canvas-white)] transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--color-midnight-ink)] uppercase tracking-widest mb-2 ml-4">Card Information</label>
              <input 
                type="text" 
                required
                className="w-full bg-[rgba(0,0,0,0.05)] border border-[var(--color-midnight-ink)] rounded-[100px_0_0_100px] py-[8px] pl-[20px] text-[var(--color-carbon-text)] text-[14px] focus:outline-none focus:bg-[var(--color-canvas-white)] transition-colors"
                placeholder="0000 0000 0000 0000"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-1/3 bg-transparent border-t border-[var(--color-midnight-ink)] text-[var(--color-midnight-ink)] font-normal text-[14px] py-[12px] hover:text-[var(--color-fog)] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[var(--color-cloud-cover)] border border-[var(--color-midnight-ink)] text-[var(--color-midnight-ink)] font-normal text-[17px] py-[12px] rounded-[20px] hover:bg-[var(--color-warm-linen)] disabled:opacity-50 transition-colors flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[var(--color-midnight-ink)] border-t-transparent rounded-full animate-spin"></div>
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
