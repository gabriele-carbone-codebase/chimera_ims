import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from './tokens';

const ThemeCtx = createContext<Palette>(light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  return <ThemeCtx.Provider value={scheme === 'dark' ? dark : light}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => useContext(ThemeCtx);
