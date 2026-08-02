import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'asd-settings-v1';

const DEFAULT_SETTINGS = {
  sound: false, // sound OFF by default (ASD-specific consideration)
  haptic: true,
  reducedMotion: false,
  fontSize: 'normal', // 'normal' | 'large' | 'extra-large'
};

// Read the OS preference at mount time so it stays testable and up to date.
const getDefaultReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const loadSettings = () => {
  const defaults = { ...DEFAULT_SETTINGS, reducedMotion: getDefaultReducedMotion() };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored ? { ...defaults, ...stored } : defaults;
  } catch {
    return defaults;
  }
};

const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    if (!(key in DEFAULT_SETTINGS)) return;
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
