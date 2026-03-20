import { useState, useCallback } from 'react';
import questionsData from '../data/questions.json';

// Simple Fisher-Yates shuffle
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useQuiz = () => {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'

  const startQuiz = useCallback(() => {
    // Pick 10 random questions (we only have 10 now, but shuffle them)
    const shuffled = shuffleArray(questionsData).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    setScreen('quiz');
  }, []);

  const handleAnswer = useCallback((answer) => {
    if (isAnswered) return; // Prevent multiple clicks

    const isCorrect = answer === questions[currentIndex].correctAnswer;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after 1.5s
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setFeedback(null);
      } else {
        setScreen('result');
      }
    }, 1500);
  }, [currentIndex, isAnswered, questions]);

  const resetQuiz = useCallback(() => {
    setScreen('start');
  }, []);

  return {
    screen,
    currentQuestion: questions[currentIndex],
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    isAnswered,
    score,
    feedback,
    startQuiz,
    handleAnswer,
    resetQuiz
  };
};
