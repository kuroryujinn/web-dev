import React from 'react';

const VARIANT_CLASSES = {
  butter: 'bg-[var(--surface-butter)]',
  coral: 'bg-[var(--surface-coral)]',
  mint: 'bg-[var(--surface-mint)]',
  sky: 'bg-[var(--surface-sky)]',
  white: 'bg-white',
};

/**
 * Accessible button with a consistent neo-brutal style.
 * Guarantees a ≥48px touch target, a visible focus ring, and proper
 * keyboard/screen-reader semantics (ASD accessibility requirements).
 */
const AccessibleButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'coral',
  className = '',
  'aria-label': ariaLabel,
  ref,
  ...rest
}) => {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`brutal-button pressable inline-flex items-center justify-center min-h-[48px] px-5 py-3 font-black uppercase tracking-[0.1em] text-[var(--ink)] transition-transform
        focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
        disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:transform-none
        ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.coral} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default AccessibleButton;
