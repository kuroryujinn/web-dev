import React, { useState } from 'react';

const EmailPasswordForm = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegister && (
        <div>
          <label htmlFor="name" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
            required
          />
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
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
          required
          minLength={6}
        />
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
        onClick={() => setIsRegister(!isRegister)}
        className="w-full text-sm font-bold text-[var(--ink-soft)] underline"
      >
        {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
      </button>
    </form>
  );
};

export default EmailPasswordForm;
