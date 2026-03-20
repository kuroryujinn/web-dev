import React from 'react';

const FeedbackOverlay = ({ isCorrect, feedback, onNext }) => {
  const feedbackImage = isCorrect ? '🌟' : '😊';
  const feedbackColor = isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className={`p-8 text-center rounded-lg shadow-xl border-4 ${feedbackColor}`}>
        <div className="text-6xl mb-4">{feedbackImage}</div>
        <p className="text-2xl font-bold mb-6">{feedback}</p>
        <button
          onClick={onNext}
          className="px-8 py-3 text-xl font-bold text-white bg-[#4A90D9] rounded-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
