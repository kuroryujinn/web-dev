import React, { useEffect, useMemo, useState } from 'react';
import AnswerTile from './AnswerTile';

const withCacheKey = (src, cacheKey) => {
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}t=${cacheKey}`;
};

const QuestionCard = ({ question, cacheKey, onAnswerSelect, selectedAnswer }) => {
  const [questionImageFailed, setQuestionImageFailed] = useState(false);

  useEffect(() => {
    setQuestionImageFailed(false);
  }, [question.id, question.questionImage]);

  const shuffledOptions = useMemo(() => {
    const options = [...question.options];
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [question.id]);

  const questionImageSrc = useMemo(
    () => withCacheKey(question.questionImage, cacheKey),
    [question.questionImage, cacheKey],
  );

  return (
    <div className="w-full max-w-2xl p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
      <p className="text-2xl">{question.questionLabel}</p>
      <div className="flex justify-center">
        {questionImageFailed ? (
          <div className="flex items-center justify-center h-64 w-full bg-gray-200 rounded-lg">
            <p className="text-xl text-gray-600">{question.questionAlt}</p>
          </div>
        ) : (
          <img
            src={questionImageSrc}
            alt={question.questionAlt}
            className="object-contain h-64 rounded-lg"
            onError={() => setQuestionImageFailed(true)}
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {shuffledOptions.map((option) => (
          <AnswerTile
            key={`${question.id}-${option.id}`}
            option={option}
            cacheKey={cacheKey}
            onSelect={() => onAnswerSelect(option)}
            isSelected={selectedAnswer?.id === option.id}
            isCorrect={option.correct}
            showResult={selectedAnswer !== null}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
