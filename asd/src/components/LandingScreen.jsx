import React from 'react';

const LandingScreen = ({ user, onStartQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F3]">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Hi {user.name}! {user.avatar}</h1>
        <p className="mt-4 text-2xl">Ready to play?</p>
        <button
          onClick={onStartQuiz}
          className="mt-8 px-8 py-4 text-2xl font-bold text-white bg-[#5CB85C] rounded-2xl"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
