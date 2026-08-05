import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import AccessibleButton from '../shared/AccessibleButton';

const FONT_SIZES = [
  { key: 'normal', label: 'Normal' },
  { key: 'large', label: 'Large' },
  { key: 'extra-large', label: 'Extra-Large' },
];

const SettingsScreen = ({ user, onBack }) => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="brutal-card raised-glass-soft bg-warm-butter/70 p-6 rounded-[2rem]">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] tracking-tight">
            Settings
          </h1>
          <p className="text-lg text-[var(--ink-soft)] font-bold mt-1">
            Make your learning experience comfortable
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-8 flex flex-col gap-4">
        {/* Sound toggle */}
        <div className="brutal-card p-5 rounded-xl bg-white flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-black text-[var(--ink)]">Sound Effects</p>
            <p className="text-sm font-bold text-[var(--ink-soft)]">Off by default — gentle sounds when correct</p>
          </div>
          <button
            onClick={() => updateSetting('sound', !settings.sound)}
            aria-pressed={settings.sound}
            aria-label="Toggle sound"
            className={`brutal-button pressable px-6 py-3 text-sm font-black uppercase min-h-[48px]
              focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
              ${settings.sound ? 'bg-[var(--surface-mint)]' : 'bg-white'}`}
          >
            {settings.sound ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Haptic toggle */}
        <div className="brutal-card p-5 rounded-xl bg-white flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-black text-[var(--ink)]">Haptic Feedback</p>
            <p className="text-sm font-bold text-[var(--ink-soft)]">Light touch vibration on supported devices</p>
          </div>
          <button
            onClick={() => updateSetting('haptic', !settings.haptic)}
            aria-pressed={settings.haptic}
            aria-label="Toggle haptic"
            className={`brutal-button pressable px-6 py-3 text-sm font-black uppercase min-h-[48px]
              focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
              ${settings.haptic ? 'bg-[var(--surface-mint)]' : 'bg-white'}`}
          >
            {settings.haptic ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Reduced motion toggle */}
        <div className="brutal-card p-5 rounded-xl bg-white flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-black text-[var(--ink)]">Reduced Motion</p>
            <p className="text-sm font-bold text-[var(--ink-soft)]">Minimize animations and movement</p>
          </div>
          <button
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
            aria-pressed={settings.reducedMotion}
            aria-label="Toggle reduced motion"
            className={`brutal-button pressable px-6 py-3 text-sm font-black uppercase min-h-[48px]
              focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
              ${settings.reducedMotion ? 'bg-[var(--surface-mint)]' : 'bg-white'}`}
          >
            {settings.reducedMotion ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Font size selector */}
        <div className="brutal-card p-5 rounded-xl bg-white">
          <p className="text-lg font-black text-[var(--ink)]">Text Size</p>
          <p className="text-sm font-bold text-[var(--ink-soft)] mb-4">Choose the reading size that feels best</p>
          <div className="flex flex-wrap gap-3">
            {FONT_SIZES.map((size) => (
              <button
                key={size.key}
                onClick={() => updateSetting('fontSize', size.key)}
                aria-pressed={settings.fontSize === size.key}
                aria-label={`Text size ${size.key}`}
                className={`brutal-button pressable px-6 py-3 text-sm font-black uppercase min-h-[48px]
                  focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
                  ${settings.fontSize === size.key ? 'bg-[var(--surface-butter)]' : 'bg-white'}`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Account section */}
        <div className="brutal-card p-5 rounded-xl bg-white">
          <p className="text-lg font-black text-[var(--ink)]">Account</p>
          <p className="text-sm font-bold text-[var(--ink-soft)] mt-1">Signed in as {user.name}</p>
          <p className="text-sm font-bold text-[var(--ink-soft)] mt-1">{user.email}</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="w-full max-w-3xl mx-auto">
        <AccessibleButton onClick={onBack} variant="white" className="px-6 py-3 text-sm">
          ← BACK TO DASHBOARD
        </AccessibleButton>
      </div>
    </div>
  );
};

export default SettingsScreen;
