"use client";

import React, { memo } from 'react';

// Using React.memo is CRUCIAL here. It prevents the other 4,999 seats from
// re-rendering when only one seat's status changes.
const Seat = memo(({ id, status, onClick }) => {
  // Map status to Tailwind colors
  const colorMap = {
    AVAILABLE: "bg-green-500 hover:bg-green-400 cursor-pointer",
    RESERVED: "bg-yellow-500 cursor-not-allowed",
    SOLD: "bg-red-500 cursor-not-allowed",
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
