"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/lib/supabase';
import SeatModal from './SeatModal';
import CheckoutForm from './CheckoutForm';

const SEAT_COUNT = 5000;
const ROWS = 50;
const SEATS_PER_ROW = 100;

const COLOR_AVAILABLE = new THREE.Color('#ecebe7');
const COLOR_LOCKED = new THREE.Color('#8c8c8c');
const COLOR_BOOKED = new THREE.Color('#000000');
const COLOR_HOVER = new THREE.Color('#a2a1a1');

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const CameraController = () => {
  const scroll = useScroll();
  const vec = new THREE.Vector3();
  
  useFrame((state) => {
    const offset = scroll.offset; // 0 to 1
    
    // Cinematic camera path
    // Starts high up, looking straight down.
    // Slowly sweeps around 180 degrees and lowers to ground level to view the stadium
    
    const radius = 120 - (offset * 40); // 120 -> 80
    const angle = offset * Math.PI * 1.2; // 0 -> ~216 degrees
    
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = 100 - (offset * 80); // 100 -> 20
    
    // Smooth camera movement using lerp
    vec.set(x, y, z);
    state.camera.position.lerp(vec, 0.1);
    
    // Always look at center stage
    state.camera.lookAt(0, 5, 0);
  });
  return null;
};

const InstancedStadium = ({ seats, onSeatClick }) => {
  const meshRef = useRef();
  const hoveredRef = useRef(null);

  const positions = useMemo(() => {
    const pos = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < SEATS_PER_ROW; c++) {
        const radius = 30 + r * 1.5;
        const angle = (Math.PI * 0.8 * (c / SEATS_PER_ROW)) - (Math.PI * 0.4);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = r * 1.2;
        
        tempObject.position.set(x, y, z);
        tempObject.lookAt(0, 0, 0);
        tempObject.updateMatrix();
        pos.push(tempObject.matrix.clone());
      }
    }
    return pos;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((matrix, i) => {
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  useFrame(() => {
    if (!meshRef.current || seats.length === 0) return;

    const hoveredIndex = hoveredRef.current;
    
    for (let i = 0; i < SEAT_COUNT; i++) {
      const seatState = seats[i]?.status || 'AVAILABLE';
      
      if (i === hoveredIndex && seatState === 'AVAILABLE') {
        tempColor.copy(COLOR_HOVER);
      } else if (seatState === 'BOOKED') {
        tempColor.copy(COLOR_BOOKED);
      } else if (seatState === 'LOCKED') {
        tempColor.copy(COLOR_LOCKED);
      } else {
        tempColor.copy(COLOR_AVAILABLE);
      }
      
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceColor.needsUpdate = true;
  });

  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      hoveredRef.current = e.instanceId;
    }
  };

  const handlePointerOut = () => {
    hoveredRef.current = null;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      onSeatClick(e.instanceId + 1);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, SEAT_COUNT]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        roughness={0.2}
        metalness={0.1}
        toneMapped={false} 
      />
    </instancedMesh>
  );
};

export default function StadiumMap() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    async function fetchSeats() {
      const { data, error } = await supabase.from('seats').select('id, status');
      const fullSeats = Array.from({ length: SEAT_COUNT }, (_, i) => ({ id: i + 1, status: 'AVAILABLE' }));

      if (!error && data) {
        data.forEach(dbSeat => {
          if (dbSeat.id >= 1 && dbSeat.id <= SEAT_COUNT) {
            fullSeats[dbSeat.id - 1].status = dbSeat.status;
          }
        });
      }
      setSeats(fullSeats);
      setLoading(false);
    }
    fetchSeats();

    const channel = supabase.channel('seats').on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, (payload) => {
        setSeats((prevSeats) => {
          const newSeats = [...prevSeats];
          const dbId = payload.new.id;
          if (dbId >= 1 && dbId <= SEAT_COUNT) {
            newSeats[dbId - 1] = { ...newSeats[dbId - 1], status: payload.new.status };
          }
          return newSeats;
        });
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleSeatClick = useCallback(async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in first to select a seat.");
      return;
    }

    const seat = seats[id - 1];
    if (seat && seat.status === 'AVAILABLE') {
      setSelectedSeat(id);
    }
  }, [seats]);

  const handleProceedToCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('seats')
      .update({ status: 'LOCKED', locked_at: new Date().toISOString(), session_id: user.id })
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
      await supabase.from('seats').update({ status: 'AVAILABLE', session_id: null, locked_at: null }).eq('id', selectedSeat).eq('session_id', user.id);
    }
    setSelectedSeat(null);
    setShowCheckout(false);
  };

  const handlePaymentSuccess = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      const { error } = await supabase.from('seats').update({ status: 'BOOKED' }).eq('id', id).eq('session_id', user.id);
      if (error) return alert("Payment succeeded but booking failed to confirm.");
      setSelectedSeat(null);
      setShowCheckout(false);
      alert(`Payment successful! You officially own Seat #${id}.`);
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center text-[var(--color-midnight-ink)] animate-pulse tracking-widest uppercase text-xs">Loading Immersive Experience...</div>;
  }

  return (
    <>
      <Canvas camera={{ position: [0, 100, 100], fov: 45 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, -50]} intensity={1.5} castShadow />
        
        <ScrollControls pages={3.5} damping={0.25}>
          
          <CameraController />
          
          <InstancedStadium seats={seats} onSeatClick={handleSeatClick} />
          
          <mesh position={[0, -2, 0]} receiveShadow>
            <cylinderGeometry args={[15, 15, 2, 32]} />
            <meshStandardMaterial color="#ecebe7" roughness={0.1} />
          </mesh>
          <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={150} blur={2} far={100} />
          
          {/* CRITICAL: pointerEvents: 'none' allows the 3D canvas underneath to be clickable! */}
          <Scroll html style={{ width: '100vw', pointerEvents: 'none' }}>
            
            {/* Top Section - Hero Redesign */}
            <div className="w-screen h-screen relative">
              <div className="absolute top-[20%] left-[8%] md:left-[12%] mix-blend-difference text-white pointer-events-none">
                <p className="text-[12px] md:text-[16px] uppercase tracking-[0.4em] font-bold mb-4 opacity-90">
                  Interactive Exhibition
                </p>
                <h1 className="text-[15vw] md:text-[12vw] font-[family-name:var(--font-letterform)] leading-[0.8] tracking-tighter">
                  TICKETS<br/>NOW.
                </h1>
              </div>
              
              <div className="absolute bottom-[15%] right-[8%] md:right-[15%] max-w-sm text-right mix-blend-difference text-white pointer-events-none">
                <p className="text-[14px] md:text-[16px] font-light opacity-80 leading-relaxed mb-8">
                  A high-concurrency study in physical space. Scroll down to descend into the architecture and secure your block on the grid.
                </p>
                <div className="flex justify-end items-center gap-4">
                  <div className="w-12 h-[1px] bg-white opacity-50"></div>
                  <p className="text-[11px] tracking-[0.4em] uppercase font-bold animate-pulse">
                    Scroll
                  </p>
                </div>
              </div>
            </div>
            
            {/* Middle Section - Story */}
            <div className="w-screen h-[100vh] flex items-center justify-start pl-[10vw]">
              <div className="max-w-2xl bg-white/70 backdrop-blur-xl p-12 rounded-3xl border border-[var(--color-cloud-cover)] shadow-2xl">
                <h2 className="text-[48px] font-[family-name:var(--font-letterform)] leading-tight mb-6 text-[var(--color-midnight-ink)]">
                  A brutalist study in<br/>high-concurrency ticketing.
                </h2>
                <p className="text-[18px] text-[var(--color-carbon-text)] font-light leading-relaxed">
                  Every 3D block below represents a live WebSocket connection to our global database. As users around the world claim their space, the architectural structure physically alters in real-time.
                </p>
              </div>
            </div>
            
            {/* Bottom Section - Ticketing Interface & Footer */}
            <div className="w-screen h-[150vh] flex flex-col items-center justify-end pb-12">
              <div className="bg-[var(--color-midnight-ink)] text-[var(--color-canvas-white)] px-10 py-5 rounded-full flex gap-10 items-center shadow-2xl pointer-events-auto border border-[var(--color-carbon-text)] mb-8 transition-transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[var(--color-cloud-cover)] rounded-sm"></div> 
                  <span className="text-[13px] uppercase tracking-[0.2em] font-bold">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[var(--color-fog)] rounded-sm"></div> 
                  <span className="text-[13px] uppercase tracking-[0.2em] font-bold">Locked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-black rounded-sm border border-gray-600"></div> 
                  <span className="text-[13px] uppercase tracking-[0.2em] font-bold">Booked</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-xl border border-gray-200 shadow-lg pointer-events-auto mb-20 text-center">
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-midnight-ink)] font-bold mb-1">
                  1. Zoom & Pan to find your seat
                </p>
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-midnight-ink)] font-bold">
                  2. Click a White Block to reserve it
                </p>
              </div>

              {/* Improved Bottom Footer Area inside the scroll */}
              <div className="w-full bg-[var(--color-canvas-white)]/90 backdrop-blur-lg border-t border-[var(--color-cloud-cover)] py-8 flex flex-col items-center justify-center pointer-events-auto mt-auto">
                <h3 className="font-[family-name:var(--font-letterform)] text-[24px] text-[var(--color-midnight-ink)] mb-2">TicketsNow Architecture</h3>
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fog)]">Powered by Next.js, Supabase & WebGL</p>
              </div>
            </div>
            
          </Scroll>
          
        </ScrollControls>
        <Environment preset="city" />
      </Canvas>

      {/* Floating Modals above the canvas z-index */}
      {selectedSeat && !showCheckout && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm">
          <div className="pointer-events-auto">
            <SeatModal seatId={selectedSeat} onCheckout={handleProceedToCheckout} onCancel={handleCancelReservation} />
          </div>
        </div>
      )}
      {showCheckout && selectedSeat && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm">
          <div className="pointer-events-auto">
            <CheckoutForm seatId={selectedSeat} onSuccess={handlePaymentSuccess} onCancel={handleCancelReservation} />
          </div>
        </div>
      )}
    </>
  );
}
