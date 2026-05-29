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
        
        <ScrollControls pages={3} damping={0.25}>
          
          <CameraController />
          
          <InstancedStadium seats={seats} onSeatClick={handleSeatClick} />
          
          <mesh position={[0, -2, 0]} receiveShadow>
            <cylinderGeometry args={[15, 15, 2, 32]} />
            <meshStandardMaterial color="#ecebe7" roughness={0.1} />
          </mesh>
          <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={150} blur={2} far={100} />
          
          <Scroll html style={{ width: '100vw' }}>
            <div className="w-screen h-screen flex flex-col items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="inline-block mb-10 px-4 py-1 border border-[var(--color-steel-gaze)] rounded-[3.4px] bg-white/50 backdrop-blur-sm">
                  <span className="text-[var(--color-midnight-ink)] text-[10px] uppercase tracking-widest font-bold">Interactive Exhibition</span>
                </div>
                <h1 className="text-[60px] md:text-[90px] font-[family-name:var(--font-letterform)] leading-[1.0] mb-8 bg-white/30 backdrop-blur-sm p-4 rounded-xl">
                  The Gallery Collection.
                </h1>
                <p className="text-[17px] tracking-widest uppercase font-bold text-[var(--color-midnight-ink)]">
                  Scroll to enter
                </p>
              </div>
            </div>
            
            <div className="w-screen h-screen flex items-center justify-start pl-[10vw] pointer-events-none">
              <div className="max-w-xl bg-white/60 backdrop-blur-md p-10 rounded-2xl border border-[var(--color-cloud-cover)] shadow-2xl">
                <h2 className="text-[40px] font-[family-name:var(--font-letterform)] leading-tight mb-4 text-[var(--color-midnight-ink)]">
                  A brutalist study in<br/>high-concurrency ticketing.
                </h2>
                <p className="text-[var(--color-carbon-text)] font-light leading-relaxed">
                  Every 3D block represents a live connection to the database. As users around the world claim their space, the structure physically alters in real-time.
                </p>
              </div>
            </div>
            
            <div className="w-screen h-screen flex flex-col items-center justify-end pb-20 pointer-events-none">
              <div className="bg-[var(--color-midnight-ink)] text-[var(--color-canvas-white)] px-8 py-4 rounded-full flex gap-8 items-center shadow-2xl pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[var(--color-cloud-cover)] rounded-sm"></div> 
                  <span className="text-[12px] uppercase tracking-widest font-bold">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[var(--color-fog)] rounded-sm"></div> 
                  <span className="text-[12px] uppercase tracking-widest font-bold">Locked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-black rounded-sm border border-gray-600"></div> 
                  <span className="text-[12px] uppercase tracking-widest font-bold">Booked</span>
                </div>
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-widest text-[var(--color-midnight-ink)] font-bold">
                Hover over the stadium blocks to select your seat
              </p>
            </div>
          </Scroll>
          
        </ScrollControls>
        <Environment preset="city" />
      </Canvas>

      {/* Floating Modals above the canvas z-index */}
      {selectedSeat && !showCheckout && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <SeatModal seatId={selectedSeat} onCheckout={handleProceedToCheckout} onCancel={handleCancelReservation} />
          </div>
        </div>
      )}
      {showCheckout && selectedSeat && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <CheckoutForm seatId={selectedSeat} onSuccess={handlePaymentSuccess} onCancel={handleCancelReservation} />
          </div>
        </div>
      )}
    </>
  );
}
