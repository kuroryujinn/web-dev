import React from 'react';

const ResultsScreen = ({ user, score, totalQuestions, onPlayAgain, onBackToHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F3]">
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold">Great job, {user.name}! {user.avatar}</h1>
        <p className="mt-4 text-2xl">You scored</p>
        <p className="my-4 text-6xl font-bold text-[#5CB85C]">{score} / {totalQuestions}</p>
        <p className="text-xl">You're doing wonderfully!</p>
        <div className="mt-8 space-x-4">
            <button
            onClick={onPlayAgain}
            className="px-6 py-3 text-xl font-bold text-white bg-[#5CB85C] rounded-2xl"
            >
            Play Again
            </button>
            <button
            onClick={onBackToHome}
            className="px-6 py-3 text-xl font-bold text-gray-700 bg-gray-200 rounded-2xl"
            >
            Go Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
