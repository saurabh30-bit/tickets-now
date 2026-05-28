"use client";

import React, { memo } from 'react';

const Seat = memo(({ id, status, onClick }) => {
  // Map new status codes to Tailwind colors
  const colorMap = {
    AVAILABLE: "bg-green-500 hover:bg-green-400 cursor-pointer",
    LOCKED: "bg-yellow-500 cursor-not-allowed",
    BOOKED: "bg-red-500 cursor-not-allowed",
  };

  return (
    <div
      onClick={() => status === 'AVAILABLE' && onClick(id)}
      className={`w-3 h-3 rounded-sm transition-colors duration-150 ${colorMap[status]}`}
      title={`Seat ${id} - ${status}`}
    ></div>
  );
});

Seat.displayName = "Seat";

export default Seat;
