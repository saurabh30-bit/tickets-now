"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Seat from './Seat';
import SeatModal from './SeatModal';
import CheckoutForm from './CheckoutForm';
import { supabase } from '@/lib/supabase';

export default function StadiumMap() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // 1. Fetch real data and subscribe to realtime changes
  useEffect(() => {
    async function fetchSeats() {
      const { data, error } = await supabase
        .from('seats')
        .select('id, status')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        setSeats(data);
      } else {
        setSeats(Array.from({ length: 5000 }, (_, i) => ({ id: i + 1, status: 'AVAILABLE' })));
      }
      setLoading(false);
    }
    fetchSeats();

    // 4. Realtime updates
    const channel = supabase
      .channel('seats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seats'
      }, (payload) => {
        // payload.new contains the updated row
        setSeats((prevSeats) => {
          const newSeats = [...prevSeats];
          const seatIndex = newSeats.findIndex(s => s.id === payload.new.id);
          if (seatIndex !== -1) {
            newSeats[seatIndex] = { ...newSeats[seatIndex], status: payload.new.status };
          }
          return newSeats;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Seat click handler (lock seat atomically via client)
  const handleSeatClick = useCallback(async (id) => {
    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in first to select a seat.");
      return;
    }

    const seat = seats.find(s => s.id === id);
    if (seat && seat.status === 'AVAILABLE') {
      // Optimistically select it so modal pops up instantly
      setSelectedSeat(id);
    }
  }, [seats]);

  const handleProceedToCheckout = async () => {
    // Actually lock it in the DB when they click "Checkout" in the modal
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Execute atomic lock query
    const { data, error } = await supabase
      .from('seats')
      .update({
        status: 'LOCKED',
        locked_at: new Date().toISOString(),
        session_id: user.id
      })
      .eq('id', selectedSeat)
      .eq('status', 'AVAILABLE')
      .select();

    if (error || !data || data.length === 0) {
      alert("Seat Taken! Someone beat you to it.");
      setSelectedSeat(null);
      return;
    }

    setShowCheckout(true);
  };

  const handleCancelReservation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // If they cancel, try to release the lock if they own it
    if (user && selectedSeat) {
      await supabase
        .from('seats')
        .update({ status: 'AVAILABLE', session_id: null, locked_at: null })
        .eq('id', selectedSeat)
        .eq('session_id', user.id);
    }

    setSelectedSeat(null);
    setShowCheckout(false);
  };

  // 3. Confirm booking
  const handlePaymentSuccess = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('seats')
        .update({
          status: 'BOOKED'
        })
        .eq('id', id)
        .eq('session_id', user.id);

      if (error) {
        alert("Payment succeeded but booking failed to confirm in database.");
        return;
      }

      setSelectedSeat(null);
      setShowCheckout(false);
      alert(`Payment successful! You officially own Seat #${id}.`);

    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

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

  if (loading) {
    return <div className="text-white text-2xl font-bold p-20 animate-pulse">Connecting to Database...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="flex flex-col gap-8 w-full items-center">
        {renderSection(3500, 1500, 75, "General Admission", "49")}
        <div className="flex justify-between w-full max-w-[1200px] gap-8">
          <div className="flex-1 flex justify-end">{renderSection(0, 1250, 25, "Left Wing", "129")}</div>
          <div className="flex-none flex items-end">{renderSection(2500, 1000, 40, "VIP Floor", "299")}</div>
          <div className="flex-1 flex justify-start">{renderSection(1250, 1250, 25, "Right Wing", "129")}</div>
        </div>
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
