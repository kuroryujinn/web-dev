import { render, screen } from '@testing-library/react';
import QuestionCard from '../QuestionCard';

const question = {
  id: 1,
  questionLabel: 'Pick one',
  questionImage: '',
  questionAlt: 'alt',
  options: [
    { id: 'a', label: 'A', image: '', correct: false },
    { id: 'b', label: 'B', image: '', correct: true },
  ],
};

test('renders answer options as raised layer above question panel', () => {
  render(
    <QuestionCard
      question={question}
      onAnswerSelect={() => {}}
      selectedAnswer={null}
    />,
  );

  expect(screen.getByTestId('question-panel')).toHaveAttribute('data-layer', 'question');
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('data-layer', 'option');
});
