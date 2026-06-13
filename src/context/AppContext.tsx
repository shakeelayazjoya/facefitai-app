import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  isInitialized: boolean;
}

interface AppContextType {
  state: AppState;
  setInitialized: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const value = {
    state: { isInitialized },
    setInitialized: (value: boolean) => setIsInitialized(value),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
