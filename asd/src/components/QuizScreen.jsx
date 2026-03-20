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
  const [cacheKey, setCacheKey] = useState(() => Date.now());

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5175');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'file-change') {
        console.log('File change detected, updating cache key.');
        setCacheKey(Date.now());
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

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

  if (currentQuestionIndex >= questions.length) {
    return <ResultsScreen user={user} score={score} totalQuestions={questions.length} onPlayAgain={handlePlayAgain} onBackToHome={onBackToHome} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F9F7F3] p-4">
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        cacheKey={cacheKey}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswer}
      />
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
