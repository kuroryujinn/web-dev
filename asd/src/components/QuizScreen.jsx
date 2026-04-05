import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard';
import FeedbackOverlay from './FeedbackOverlay';
import ResultsScreen from './ResultsScreen';
import questions from '../data/questions.json';

const QuizScreen = ({ user, onBackToHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    if (option.correct) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-slate-800">LOADING_NEURAL_DATA...</h2>
        <button onClick={onBackToHome} className="mt-4 text-sky-600 font-bold uppercase tracking-widest">
          [ ABORT_MISSION ]
        </button>
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return <ResultsScreen user={user} score={score} totalQuestions={questions.length} onPlayAgain={handlePlayAgain} onBackToHome={onBackToHome} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-start py-8 lg:py-12 min-h-screen bg-transparent p-4 lg:p-12 w-full overflow-x-hidden">
      <div className="w-full max-w-5xl mb-12 flex flex-col items-center relative z-10">
        <div className="w-full max-w-4xl flex justify-between items-end mb-8 px-4">
          <div className="flex flex-col">
            <span className="text-xs font-black text-sky-600 uppercase tracking-[0.4em] mb-2">Uplink Status</span>
            <span className="text-3xl md:text-5xl font-black text-slate-800 tracking-wider leading-none">
              QUESTION_{currentQuestionIndex + 1} <span className="text-slate-400/30">// {questions.length}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-purple-400 uppercase tracking-[0.5em] mb-4">Neural Score</span>
            <span className="text-6xl md:text-8xl font-black neon-text-blue tabular-nums leading-none">
              {score * 100}
            </span>
          </div>
        </div>
        <div className="w-full max-w-6xl h-4 bg-black/40 rounded-full overflow-hidden border-2 border-white/5 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out rounded-full relative z-10 shadow-[0_0_25px_rgba(34,211,238,0.8)]"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-[90vw] flex-1 flex flex-col items-center">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
        />
      </div>
      
      {showFeedback && selectedAnswer && (
        <FeedbackOverlay
          isCorrect={selectedAnswer.correct}
          feedback={selectedAnswer.correct ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  );
};

export default QuizScreen;
