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
    <nav className="fixed top-0 w-full z-40 bg-[var(--color-canvas-white)]/90 backdrop-blur-md border-b border-[var(--color-steel-gaze)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-[20px] font-[family-name:var(--font-letterform)] text-[var(--color-midnight-ink)] tracking-tight">Accept&amp;Reserve</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-[14px] text-[var(--color-midnight-ink)] hover:text-[var(--color-fog)] transition-colors">Exhibitions</a>
              <a href="#" className="text-[14px] text-[var(--color-midnight-ink)] hover:text-[var(--color-fog)] transition-colors">About</a>
              <Link href="/admin" className="text-[14px] text-[var(--color-fog)] hover:text-[var(--color-midnight-ink)] transition-colors">
                Command Center
              </Link>
            </div>
          </div>
          <div>
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <span className="text-[var(--color-fog)] text-[10px] hidden sm:inline-block">
                    {user.id.substring(0, 8)}...
                  </span>
                  <button onClick={handleLogout} className="bg-transparent text-[var(--color-midnight-ink)] text-[14px] px-[15px] py-[8px] hover:text-[var(--color-fog)] transition-colors">
                    Log Out
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="bg-[var(--color-cloud-cover)] border border-[var(--color-midnight-ink)] text-[var(--color-midnight-ink)] text-[14px] py-[8px] px-[20px] rounded-[20px] hover:bg-[var(--color-warm-linen)] transition-colors">
                  Authenticate
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
