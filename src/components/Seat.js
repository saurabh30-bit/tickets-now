"use client";

import React, { memo } from 'react';

const Seat = memo(({ id, status, onClick }) => {
  // Monochrome palette matching Accept&Proceed
  const colorMap = {
    AVAILABLE: "bg-[var(--color-cloud-cover)] border border-[var(--color-midnight-ink)] cursor-pointer",
    LOCKED: "bg-[var(--color-fog)] cursor-not-allowed border border-[var(--color-midnight-ink)]",
    BOOKED: "bg-[var(--color-midnight-ink)] cursor-not-allowed",
  };

  return (
    <div
      onClick={() => status === 'AVAILABLE' && onClick(id)}
      className={`w-3 h-3 rounded-sm transition-colors duration-150 seat-3d ${colorMap[status]}`}
      title={`Seat ${id} - ${status}`}
    ></div>
  );
});

Seat.displayName = "Seat";

export default Seat;
