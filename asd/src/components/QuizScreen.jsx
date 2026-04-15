import React, { useState } from 'react';
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
    setCurrentQuestionIndex((prev) => prev + 1);
  };
  
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (currentQuestionIndex >= questions.length) {
    return <ResultsScreen user={user} score={score} totalQuestions={questions.length} onPlayAgain={handlePlayAgain} onBackToHome={onBackToHome} />;
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-[var(--ink)]">LOADING_QUESTIONS...</h2>
        <button onClick={onBackToHome} className="mt-5 brutal-button pressable px-6 py-3 text-[var(--ink)] font-black uppercase tracking-[0.14em] bg-[var(--surface-butter)]">
          [ ABORT_MISSION ]
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-start py-8 lg:py-12 min-h-screen bg-transparent p-4 lg:p-10 w-full overflow-x-hidden">
      <div className="w-full max-w-5xl mb-8 flex flex-col items-center relative z-10 brutal-card raised-glass-soft bg-warm-butter/70 p-4 md:p-6">
        <div className="w-full max-w-4xl flex justify-between items-end mb-4 px-2 md:px-4">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[var(--ink-soft)] uppercase tracking-[0.28em] mb-2">Quiz Progress</span>
            <span className="text-3xl md:text-5xl font-black text-[var(--ink)] tracking-tight leading-none">
              QUESTION {currentQuestionIndex + 1} <span className="text-[var(--ink-soft)]">/ {questions.length}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.3em] mb-3">Score</span>
            <span className="text-5xl md:text-7xl font-black text-[var(--ink)] tabular-nums leading-none">
              {score * 100}
            </span>
          </div>
        </div>
        <div className="w-full max-w-6xl h-4 bg-white/70 rounded-full overflow-hidden border-[3px] border-[var(--ink)]">
          <div 
            className="h-full bg-[var(--surface-coral)] transition-all duration-500 ease-out rounded-full"
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
