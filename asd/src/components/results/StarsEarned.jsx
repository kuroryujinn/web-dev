import React from 'react';

/**
 * Three stars; earned ones are bright, unearned ones dimmed.
 * Exposed to assistive tech with an explicit label.
 */
const StarsEarned = ({ stars }) => (
  <div
    className="flex justify-center gap-2 my-4"
    role="img"
    aria-label={`${stars} of 3 stars earned`}
  >
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        aria-hidden="true"
        className={`text-4xl md:text-5xl transition-all duration-300 ${
          i <= stars ? 'opacity-100 scale-110' : 'opacity-30 scale-90'
        }`}
      >
        ⭐
      </span>
    ))}
  </div>
);

export default StarsEarned;
