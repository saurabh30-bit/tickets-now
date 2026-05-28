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

    const channel = supabase
      .channel('seats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seats'
      }, (payload) => {
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

  const handleSeatClick = useCallback(async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in first to select a seat.");
      return;
    }

    const seat = seats.find(s => s.id === id);
    if (seat && seat.status === 'AVAILABLE') {
      setSelectedSeat(id);
    }
  }, [seats]);

  const handleProceedToCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

  const handlePaymentSuccess = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('seats')
        .update({ status: 'BOOKED' })
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
      <div className="flex flex-col items-center">
        <h3 className="text-[var(--color-fog)] font-bold uppercase tracking-[0.2em] text-[10px] mb-2 font-[family-name:var(--font-messina-sans)]">{title} — ${price}</h3>
        <div className="grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {sectionSeats.map((seat) => (
            <Seat key={seat.id} id={seat.id} status={seat.status} onClick={handleSeatClick} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-[var(--color-midnight-ink)] text-xl font-[family-name:var(--font-letterform)] p-20 animate-pulse">Loading stadium...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center relative pt-20 pb-40">
      
      <div className="stadium-container w-full flex justify-center">
        {/* ISOMETRIC TILT WRAPPER */}
        <div className="isometric-view p-16 flex flex-col gap-12 items-center">
          
          {renderSection(3500, 1500, 75, "General Admission", "49")}
          
          <div className="flex justify-between w-full max-w-[1200px] gap-12">
            <div className="flex-1 flex justify-end">{renderSection(0, 1250, 25, "Left Wing", "129")}</div>
            <div className="flex-none flex items-end">{renderSection(2500, 1000, 40, "VIP Floor", "299")}</div>
            <div className="flex-1 flex justify-start">{renderSection(1250, 1250, 25, "Right Wing", "129")}</div>
          </div>
          
          <div className="w-[400px] h-[80px] bg-[var(--color-canvas-white)] border border-[var(--color-midnight-ink)] stadium-stage mt-8 flex items-center justify-center">
             <span className="text-[var(--color-midnight-ink)] font-[family-name:var(--font-letterform)] tracking-[0.3em] text-sm uppercase">Stage</span>
          </div>
          
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
