"use client";

import React, { useState, useCallback } from 'react';
import Seat from './Seat';

const TOTAL_SEATS = 5000;

export default function StadiumMap() {
  // Initialize 5,000 seats as AVAILABLE
  const [seats, setSeats] = useState(() => 
    Array.from({ length: TOTAL_SEATS }, (_, i) => ({
      id: i + 1,
      status: 'AVAILABLE'
    }))
  );

  // useCallback ensures the function reference doesn't change on every render,
  // which is required for React.memo in the Seat component to work properly!
  const handleSeatClick = useCallback((id) => {
    setSeats((prevSeats) => {
      // Simulate locking the seat (optimistic UI update before calling Role 2's API)
      const newSeats = [...prevSeats];
      const seatIndex = newSeats.findIndex(s => s.id === id);
      
      if (newSeats[seatIndex].status === 'AVAILABLE') {
        newSeats[seatIndex] = { ...newSeats[seatIndex], status: 'RESERVED' };
      }
      return newSeats;
    });
  }, []);

  return (
    <div className="w-full flex justify-center">
      {/* 
        Using CSS Grid with 100 columns. 
        5000 seats / 100 cols = 50 rows.
        This handles the layout natively in the browser's paint engine, 
        making it extremely fast!
      */}
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
    </div>
  );
}
