"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSeats: 5000,
    available: 5000,
    locked: 0,
    booked: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const AVERAGE_TICKET_PRICE = 150;

  useEffect(() => {
    // 1. Initial Data Fetch
    const fetchStats = async () => {
      const { data, error } = await supabase.from('seats').select('status');
      if (data) {
        updateMetrics(data);
      }
      setLoading(false);
    };
    
    fetchStats();

    // 2. Realtime Listener
    const channel = supabase.channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => {
        // When any seat changes, refetch all to get accurate counts 
        // (for a huge app, you'd aggregate this on the backend, but this is perfect for the hackathon)
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateMetrics = (seatsArray) => {
    let availableCount = 0;
    let lockedCount = 0;
    let bookedCount = 0;

    seatsArray.forEach(seat => {
      if (seat.status === 'AVAILABLE') availableCount++;
      else if (seat.status === 'LOCKED') lockedCount++;
      else if (seat.status === 'BOOKED') bookedCount++;
    });

    setStats({
      totalSeats: seatsArray.length || 5000,
      available: availableCount,
      locked: lockedCount,
      booked: bookedCount,
      revenue: bookedCount * AVERAGE_TICKET_PRICE
    });
  };

  const handleResetStadium = async () => {
    const confirmReset = window.confirm("🚨 WARNING: This will delete ALL reservations and bookings. Are you sure?");
    if (!confirmReset) return;

    setIsResetting(true);
    
    // Massive query to wipe all locks and bookings
    const { error } = await supabase
      .from('seats')
      .update({ status: 'AVAILABLE', session_id: null, locked_at: null })
      .neq('status', 'AVAILABLE'); // Only update seats that aren't already available

    if (error) {
      alert("Failed to reset stadium: " + error.message);
    } else {
      alert("Stadium has been completely reset!");
    }
    
    setIsResetting(false);
  };

  const handleReleaseLocks = async () => {
    const confirmRelease = window.confirm("Release all PENDING locks? (Booked seats will be kept safe).");
    if (!confirmRelease) return;

    await supabase
      .from('seats')
      .update({ status: 'AVAILABLE', session_id: null, locked_at: null })
      .eq('status', 'LOCKED');
      
    alert("Pending locks released!");
  };

  if (loading) {
    return <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center font-bold text-2xl animate-pulse">Initializing Command Center...</div>;
  }

  const percentageSold = ((stats.booked / stats.totalSeats) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center border-b border-gray-800 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Command Center
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-2">
              SYSTEM STATUS: <span className="text-green-500">ONLINE</span> | STAMPEDE PROTECTION: <span className="text-green-500">ACTIVE</span>
            </p>
          </div>
          <Link href="/">
            <button className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg text-sm">
              &larr; Back to Stadium
            </button>
          </Link>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stats.revenue > 0 ? 'bg-green-500/20' : 'bg-green-500/5'} rounded-full blur-2xl transition-all duration-500`}></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Total Revenue</h3>
            <p className="text-4xl font-black text-white">${stats.revenue.toLocaleString()}<span className="text-gray-600 text-xl">.00</span></p>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stats.booked > 0 ? 'bg-red-500/20' : 'bg-red-500/5'} rounded-full blur-2xl transition-all duration-500`}></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Seats Booked</h3>
            <p className="text-4xl font-black text-white">{stats.booked.toLocaleString()} <span className="text-gray-600 text-lg font-normal">/ {stats.totalSeats.toLocaleString()}</span></p>
            <div className="w-full bg-gray-900 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-1000 ease-out" style={{ width: `${percentageSold}%` }}></div>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stats.locked > 0 ? 'bg-yellow-500/20' : 'bg-yellow-500/5'} rounded-full blur-2xl transition-all duration-500`}></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Locked (Pending)</h3>
            <p className="text-4xl font-black text-white">{stats.locked.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Active checkout sessions</p>
          </div>
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Available Seats</h3>
            <p className="text-4xl font-black text-white">{stats.available.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LIVE ACTIVITY FEED (Still mock for visual flair, as logging requires a separate DB table) */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live System Logs
            </h3>
            <div className="space-y-4 font-mono text-sm opacity-50">
              <p className="text-gray-500 italic">Database connection active. Supabase Realtime channel connected.</p>
              <p className="text-gray-500 italic">Waiting for transaction events...</p>
              {/* If we had an event logging table, we would map it here. For the hackathon, the metrics updating is the wow-factor. */}
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
              ⚠️ Danger Zone
            </h3>
            <p className="text-gray-500 text-sm mb-6 flex-grow">
              These actions directly affect the production database. Use with extreme caution during a live event.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={handleReleaseLocks}
                className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-500 font-bold py-4 rounded-xl transition-all text-sm"
              >
                RELEASE ALL PENDING LOCKS
              </button>
              <button 
                onClick={handleResetStadium}
                disabled={isResetting}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] text-sm tracking-widest"
              >
                {isResetting ? "WIPING DATABASE..." : "RESET STADIUM TO EMPTY"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
