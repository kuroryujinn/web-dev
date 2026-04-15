import { fireEvent, render, screen } from '@testing-library/react';
import AnswerTile from '../AnswerTile';

const option = { id: 'a', label: 'Dog', image: '', correct: false };

describe('AnswerTile depth states', () => {
  test('renders base raised state before answer reveal', () => {
    render(
      <AnswerTile
        option={option}
        onSelect={() => {}}
        isSelected={false}
        isCorrect={false}
        showResult={false}
      />,
    );

    const tile = screen.getByRole('button', { name: /dog/i });
    expect(tile).toHaveAttribute('data-depth-state', 'raised');
    expect(tile).toHaveAttribute('data-layer', 'option');
  });

  test('renders dropped-negative state for wrong selected answer', () => {
    render(
      <AnswerTile
        option={option}
        onSelect={() => {}}
        isSelected
        isCorrect={false}
        showResult
      />,
    );

    const tile = screen.getByRole('button', { name: /dog/i });
    expect(tile).toHaveAttribute('data-depth-state', 'dropped-negative');
  });

  test('calls onSelect when interactable and blocks when result is shown', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <AnswerTile
        option={option}
        onSelect={onSelect}
        isSelected={false}
        isCorrect={false}
        showResult={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    rerender(
      <AnswerTile
        option={option}
        onSelect={onSelect}
        isSelected
        isCorrect={false}
        showResult
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
