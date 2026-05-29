"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getSession();

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
    const { error } = await supabase.auth.signInAnonymously();
    if (error) alert("Error logging in.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[30px] px-6 py-3 transition-all duration-500 hover:bg-white/90">
      <div className="flex items-center justify-between h-12">
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-midnight-ink)] rounded-full flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">A&R</span>
          </div>
          <span className="text-[18px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] tracking-tight">Accept&amp;Reserve</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10 bg-white/40 px-6 py-2 rounded-full border border-gray-100">
          <a href="#" className="text-[13px] font-medium tracking-wide text-[var(--color-midnight-ink)] hover:text-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all">Exhibitions</a>
          <a href="#" className="text-[13px] font-medium tracking-wide text-[var(--color-midnight-ink)] hover:text-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all">About</a>
          <Link href="/admin" className="text-[13px] font-medium tracking-wide text-[var(--color-fog)] hover:text-black transition-colors">
            Command Center
          </Link>
        </div>

        <div className="flex items-center">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-[var(--color-fog)] text-[11px] font-mono bg-gray-100 px-3 py-1 rounded-full hidden sm:inline-block border border-gray-200">
                  {user.id.substring(0, 8)}
                </span>
                <button onClick={handleLogout} className="text-[13px] font-medium text-[var(--color-midnight-ink)] hover:text-black transition-colors ml-2">
                  Log Out
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="bg-[var(--color-midnight-ink)] text-white text-[13px] font-medium py-[10px] px-[24px] rounded-full hover:bg-black transition-transform hover:scale-105 shadow-md">
                Authenticate
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
