import React, { createContext, useState, useEffect, ReactNode } from 'react';

export const SettingsContext = createContext<any>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data.site_name) {
          document.title = data.site_name;
        }
      })
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
