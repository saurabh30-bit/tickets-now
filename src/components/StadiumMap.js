"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '@/lib/supabase';
import SeatModal from './SeatModal';
import CheckoutForm from './CheckoutForm';

const SEAT_COUNT = 5000;
const ROWS = 50;
const SEATS_PER_ROW = 100;

// Color Palette from Accept&Proceed
const COLOR_AVAILABLE = new THREE.Color('#ecebe7'); // Cloud Cover
const COLOR_LOCKED = new THREE.Color('#8c8c8c');    // Fog
const COLOR_BOOKED = new THREE.Color('#000000');    // Midnight Ink
const COLOR_HOVER = new THREE.Color('#a2a1a1');     // Steel Gaze

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const InstancedStadium = ({ seats, onSeatClick }) => {
  const meshRef = useRef();
  
  // Use a ref for hover to avoid React state render loops on pointer move
  const hoveredRef = useRef(null);

  // Compute Layout once
  const positions = useMemo(() => {
    const pos = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < SEATS_PER_ROW; c++) {
        // Amphitheater math
        const radius = 30 + r * 1.5;
        const angle = (Math.PI * 0.8 * (c / SEATS_PER_ROW)) - (Math.PI * 0.4);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = r * 1.2;
        
        // Make seats look at the center stage
        tempObject.position.set(x, y, z);
        tempObject.lookAt(0, 0, 0);
        tempObject.updateMatrix();
        pos.push(tempObject.matrix.clone());
      }
    }
    return pos;
  }, []);

  // Update matrices and colors
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Set initial matrices
    positions.forEach((matrix, i) => {
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  useFrame(() => {
    if (!meshRef.current || seats.length === 0) return;

    // Update colors on every frame based on ref and props
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
      // Direct ref mutation prevents React from re-rendering the component 60 times a second
      hoveredRef.current = e.instanceId;
    }
  };

  const handlePointerOut = () => {
    hoveredRef.current = null;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) {
      onSeatClick(e.instanceId + 1); // seat IDs are 1-indexed in DB
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
      const { data, error } = await supabase
        .from('seats')
        .select('id, status');

      // Always create a full 5000 array so index `i` matches id `i+1`
      const fullSeats = Array.from({ length: SEAT_COUNT }, (_, i) => ({
        id: i + 1,
        status: 'AVAILABLE'
      }));

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

    const channel = supabase
      .channel('seats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seats'
      }, (payload) => {
        setSeats((prevSeats) => {
          const newSeats = [...prevSeats];
          const dbId = payload.new.id;
          if (dbId >= 1 && dbId <= SEAT_COUNT) {
            newSeats[dbId - 1] = { ...newSeats[dbId - 1], status: payload.new.status };
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

    const seat = seats[id - 1]; // Direct array access since we mapped it exactly
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

  if (loading) {
    return <div className="text-[var(--color-midnight-ink)] text-xl font-[family-name:var(--font-letterform)] p-20 animate-pulse">Loading 3D Engine...</div>;
  }

  return (
    <div className="w-full h-[800px] flex flex-col items-center relative z-0">
      
      <div className="w-full h-full cursor-grab active:cursor-grabbing border-y border-[var(--color-cloud-cover)]">
        <Canvas camera={{ position: [0, 80, -100], fov: 50 }}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[50, 100, -50]} intensity={1.5} castShadow />
          
          <InstancedStadium seats={seats} onSeatClick={handleSeatClick} />
          
          {/* Stage Platform */}
          <mesh position={[0, -2, 0]} receiveShadow>
            <cylinderGeometry args={[15, 15, 2, 32]} />
            <meshStandardMaterial color="#ecebe7" roughness={0.1} />
          </mesh>

          <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={150} blur={2} far={100} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 - 0.1} 
            minDistance={30} 
            maxDistance={200}
            target={[0, 20, 0]}
          />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest text-[var(--color-fog)] pointer-events-none">
        <p>Click & Drag to Rotate</p>
        <p>Scroll to Zoom</p>
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
