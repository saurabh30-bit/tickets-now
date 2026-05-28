"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getSession();

    // Listen for changes on auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    // Using anonymous sign in for quick hackathon access
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      alert("Error logging in. Please ensure Anonymous Sign-In is enabled in Supabase.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-black text-white tracking-tighter">Tickets<span className="text-orange-500">Now</span></span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Events</a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
              <Link href="/admin" className="text-red-500 hover:text-red-400 px-3 py-2 rounded-md text-sm font-bold transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
          <div>
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-xs hidden sm:inline-block border border-gray-700 px-2 py-1 rounded">
                    ID: {user.id.substring(0, 8)}...
                  </span>
                  <button onClick={handleLogout} className="bg-transparent border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-bold py-2 px-4 rounded-lg transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-[0_0_10px_rgba(255,115,0,0.3)]">
                  Log In to Buy
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
