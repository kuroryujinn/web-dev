import React, { useEffect, useMemo, useState } from 'react';

const withCacheKey = (src, cacheKey) => {
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}t=${cacheKey}`;
};

const AnswerTile = ({ option, cacheKey, onSelect, isSelected, isCorrect, showResult }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [option.image, option.label]);

  const optionImageSrc = useMemo(
    () => withCacheKey(option.image, cacheKey),
    [option.image, cacheKey],
  );

  const getBorderColor = () => {
    if (!showResult) {
      return 'border-gray-300';
    }
    if (isSelected) {
      return isCorrect ? 'border-green-500' : 'border-red-500';
    }
    if (isCorrect) {
        return 'border-green-500';
    }
    return 'border-gray-300 opacity-50';
  };

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-xl border-2 ${isSelected ? 'border-[#4A90D9] bg-blue-50' : 'border-gray-200'}`}
      style={{ minWidth: 64, minHeight: 64 }}
      onClick={onSelect}
    >
      {imageFailed ? (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl mb-2">
          <span className="text-lg">{option.label}</span>
        </div>
      ) : (
        <img
          src={optionImageSrc}
          alt={option.label}
          className="w-16 h-16 object-contain mb-2"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="text-md font-medium">{option.label}</span>
    </div>
  );
};

export default AnswerTile;
