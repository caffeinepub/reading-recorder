import { useState, useEffect } from 'react';

interface Settings {
  bitrate: number;
  sampleRate: number;
  autoDelete: boolean;
  maxStorage: number;
  playbackSpeed: number;
  autoPlayNext: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  bitrate: 128000,
  sampleRate: 44100,
  autoDelete: false,
  maxStorage: 1000,
  playbackSpeed: 1.0,
  autoPlayNext: false,
};

const STORAGE_KEY = 'reading-recorder-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
