import React from 'react';
import { ProgressBar } from './ProgressBar';
import { AnswerOption } from './AnswerOption';
import { FeedbackBanner } from './FeedbackBanner';

export const QuizCard = ({ 
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  feedback,
  onAnswer
}) => {
  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-[600px] bg-bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          
          return (
            <AnswerOption
              key={index}
              label={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isDisabled={isAnswered}
              onClick={() => onAnswer(option)}
            />
          );
        })}
      </div>

      {isAnswered && (
        <FeedbackBanner feedback={feedback} />
      )}
    </div>
  );
};
