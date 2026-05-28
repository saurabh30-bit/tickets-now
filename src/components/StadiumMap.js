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

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handleCancelReservation = () => {
    setSelectedSeat(null);
    setShowCheckout(false);
  };

  const handlePaymentSuccess = (id) => {
    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const seatIndex = newSeats.findIndex(s => s.id === id);
      if (seatIndex !== -1) {
        newSeats[seatIndex] = { ...newSeats[seatIndex], status: 'SOLD' };
      }
      return newSeats;
    });
    setSelectedSeat(null);
    setShowCheckout(false);
    alert(`Payment successful! You officially own Seat #${id}.`);
  };

  return (
    <div className="w-full flex justify-center relative">
      <div 
        className="grid gap-[2px]" 
        style={{ gridTemplateColumns: 'repeat(100, minmax(0, 1fr))' }}
      >
        {seats.map((seat) => (
          <Seat 
            key={seat.id} 
            id={seat.id} 
            status={seat.status} 
            onClick={handleSeatClick} 
          />
        ))}
      </div>

      {selectedSeat && !showCheckout && (
        <SeatModal 
          seatId={selectedSeat} 
          onCheckout={handleProceedToCheckout} 
          onCancel={handleCancelReservation} 
        />
      )}

      {showCheckout && selectedSeat && (
        <CheckoutForm 
          seatId={selectedSeat}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancelReservation}
        />
      )}
    </div>
  );
}
