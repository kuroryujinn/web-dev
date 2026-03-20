import React from 'react';

export const AnswerOption = ({ 
  label, 
  isSelected, 
  isCorrect, 
  isDisabled, 
  onClick 
}) => {
  // Determine styles based on state
  let baseStyle = "w-full min-h-[60px] p-4 text-left text-lg md:text-xl rounded-xl border-2 transition-all duration-200 outline-none ";
  
  if (isDisabled) {
    if (isCorrect) {
      // Reveal correct answer
      baseStyle += "bg-correct-green border-correct-green text-white";
    } else if (isSelected && !isCorrect) {
      // Show selected wrong answer
      baseStyle += "bg-incorrect-red border-incorrect-red text-white";
    } else {
      // Disabled unselected option
      baseStyle += "bg-white border-gray-200 text-gray-400 opacity-60";
    }
  } else {
    // Default interactive state
    baseStyle += "bg-white border-gray-300 text-text-primary hover:bg-blue-50 focus:ring-4 focus:ring-accent-blue/30 cursor-pointer";
  }

  return (
    <button
      className={baseStyle}
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      {label}
    </button>
  );
};
