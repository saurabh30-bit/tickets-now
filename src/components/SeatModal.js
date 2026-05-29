"use client";

import React from 'react';

export default function SeatModal({ seatId, onCheckout, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/85 backdrop-blur-2xl w-full max-w-sm rounded-[30px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-10 transform animate-in zoom-in-95 duration-500">
        
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 bg-black/5 border border-black/10 rounded-full mb-6">
            <span className="text-[var(--color-midnight-ink)] text-[9px] uppercase tracking-[0.2em] font-bold">Selected Block</span>
          </div>
          <h2 className="text-[48px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] leading-[1.0] mb-2 tracking-tighter">
            No. {seatId}
          </h2>
          <p className="text-[12px] text-[var(--color-carbon-text)] tracking-wide uppercase mt-4">
            Status: <span className="text-[var(--color-midnight-ink)] font-bold">Available</span>
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onCheckout}
            className="w-full bg-[var(--color-midnight-ink)] text-white font-medium text-[15px] py-[16px] rounded-[24px] hover:bg-black hover:scale-[1.02] shadow-lg transition-all"
          >
            Acquire Block
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-transparent text-[var(--color-fog)] font-medium text-[13px] py-[12px] hover:text-black hover:bg-black/5 rounded-[24px] transition-all"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
