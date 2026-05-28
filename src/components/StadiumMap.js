"use client";

import React, { useState, useCallback } from 'react';
import Seat from './Seat';
import SeatModal from './SeatModal';
import CheckoutForm from './CheckoutForm';

const TOTAL_SEATS = 5000;

export default function StadiumMap() {
  const [seats, setSeats] = useState(() => 
    Array.from({ length: TOTAL_SEATS }, (_, i) => ({
      id: i + 1,
      status: 'AVAILABLE'
    }))
  );

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSeatClick = useCallback((id) => {
    setSeats((prevSeats) => {
      const seat = prevSeats.find(s => s.id === id);
      if (seat && seat.status === 'AVAILABLE') {
        setSelectedSeat(id);
      }
      return prevSeats;
    });
  }, []);

  const handleProceedToCheckout = () => setShowCheckout(true);
  const handleCancelReservation = () => { setSelectedSeat(null); setShowCheckout(false); };

  const handlePaymentSuccess = (id) => {
    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const seatIndex = newSeats.findIndex(s => s.id === id);
      if (seatIndex !== -1) newSeats[seatIndex] = { ...newSeats[seatIndex], status: 'SOLD' };
      return newSeats;
    });
    setSelectedSeat(null);
    setShowCheckout(false);
    alert(`Payment successful! You officially own Seat #${id}.`);
  };

  // Helper function to render a specific slice of seats into a grid
  const renderSection = (startIndex, count, cols, title, price) => {
    const sectionSeats = seats.slice(startIndex, startIndex + count);
    return (
      <div className="bg-black/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl flex flex-col items-center shadow-xl">
        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">{title}</h3>
        <p className="text-orange-500 font-black mb-4">${price}</p>
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {sectionSeats.map((seat) => (
            <Seat key={seat.id} id={seat.id} status={seat.status} onClick={handleSeatClick} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* STADIUM LAYOUT */}
      <div className="flex flex-col gap-8 w-full items-center">
        {/* Top: Back General Admission */}
        {renderSection(3500, 1500, 75, "General Admission", "49")}
        
        <div className="flex justify-between w-full max-w-[1200px] gap-8">
          {/* Left Wing */}
          <div className="flex-1 flex justify-end">
            {renderSection(0, 1250, 25, "Left Wing", "129")}
          </div>

          {/* Center Stage / VIP */}
          <div className="flex-none flex items-end">
            {renderSection(2500, 1000, 40, "VIP Floor", "299")}
          </div>

          {/* Right Wing */}
          <div className="flex-1 flex justify-start">
            {renderSection(1250, 1250, 25, "Right Wing", "129")}
          </div>
        </div>
        
        {/* The "Stage" Representation */}
        <div className="w-96 h-12 bg-gradient-to-t from-gray-800 to-transparent border-b-4 border-orange-500 rounded-t-full mt-4 flex items-end justify-center pb-2">
           <span className="text-gray-500 font-black tracking-[0.5em] text-sm">STAGE</span>
        </div>
      </div>

      {selectedSeat && !showCheckout && (
        <SeatModal seatId={selectedSeat} onCheckout={handleProceedToCheckout} onCancel={handleCancelReservation} />
      )}
      {showCheckout && selectedSeat && (
        <CheckoutForm seatId={selectedSeat} onSuccess={handlePaymentSuccess} onCancel={handleCancelReservation} />
      )}
    </div>
  );
}
