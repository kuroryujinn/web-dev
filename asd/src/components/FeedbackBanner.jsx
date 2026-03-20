import React from 'react';

export const FeedbackBanner = ({ feedback }) => {
  if (!feedback) return null;

  const isCorrect = feedback === 'correct';
  const bgColor = isCorrect ? 'bg-correct-green' : 'bg-feedback-bg';
  const textColor = isCorrect ? 'text-white' : 'text-text-primary';
  const message = isCorrect ? 'Great job! ⭐' : 'Not quite! Keep going 💛';
  
  return (
    <div 
      className={`mt-6 p-4 rounded-xl text-center text-xl font-bold transition-opacity duration-300 ${bgColor} ${textColor}`}
      role="status"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};
