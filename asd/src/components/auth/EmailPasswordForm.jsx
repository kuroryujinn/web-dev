import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const inputClass =
  'w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]';

const EmailPasswordForm = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (isRegister && !name.trim()) {
      next.name = 'Name is required';
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email.trim(), password, name.trim());
      } else {
        await onLogin(email.trim(), password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setErrors({});
    setError('');
  };

  const fieldError = (field) =>
    errors[field] && (
      <p id={`${field}-error`} role="alert" className="mt-1 text-red-600 text-sm font-bold">
        {errors[field]}
      </p>
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {isRegister && (
        <div>
          <label htmlFor="name" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleChange(setName, 'name')}
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {fieldError('name')}
        </div>
      )}
      <div>
        <label htmlFor="email" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleChange(setEmail, 'email')}
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {fieldError('email')}
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handleChange(setPassword, 'password')}
          className={inputClass}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          required
          minLength={MIN_PASSWORD_LENGTH}
        />
        {fieldError('password')}
      </div>

      {error && (
        <p className="text-red-500 text-sm font-bold" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.12em] disabled:opacity-50"
      >
        {loading ? 'LOADING...' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
      </button>

      <button
        type="button"
        onClick={toggleMode}
        className="w-full text-sm font-bold text-[var(--ink-soft)] underline"
      >
        {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
      </button>
    </form>
  );
};

export default EmailPasswordForm;
