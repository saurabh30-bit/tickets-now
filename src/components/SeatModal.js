"use client";

import React from 'react';

export default function SeatModal({ seatId, onCheckout, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-midnight-ink)]/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-canvas-white)] w-full max-w-sm rounded-[8px] border border-[var(--color-midnight-ink)] shadow-2xl p-8 transform animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="mb-8">
          <div className="inline-block px-2 py-1 border border-[var(--color-steel-gaze)] rounded-[3.4px] mb-4">
            <span className="text-[var(--color-midnight-ink)] text-[10px] uppercase tracking-widest font-bold">Selected Piece</span>
          </div>
          <h2 className="text-[34px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] leading-[1.0] mb-2">
            No. {seatId}
          </h2>
          <p className="text-[14px] text-[var(--color-fog)] font-light">
            Status: <span className="text-[var(--color-midnight-ink)]">Available for acquisition</span>
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onCheckout}
            className="w-full bg-[var(--color-cloud-cover)] border border-[var(--color-midnight-ink)] text-[var(--color-midnight-ink)] font-normal text-[17px] py-[12px] rounded-[20px] hover:bg-[var(--color-warm-linen)] transition-colors"
          >
            Acquire Piece
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-transparent text-[var(--color-fog)] font-normal text-[14px] py-[12px] hover:text-[var(--color-midnight-ink)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
