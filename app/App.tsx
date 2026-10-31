import './src/i18n';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Newsreader_500Medium } from '@expo-google-fonts/newsreader/500Medium';
import { InstrumentSans_400Regular } from '@expo-google-fonts/instrument-sans/400Regular';
import { InstrumentSans_500Medium } from '@expo-google-fonts/instrument-sans/500Medium';
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular';
import { AppProvider, useApp } from './src/state/AppState';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AuthScreen } from './src/screens/AuthScreen';
import { BusinessScreen } from './src/screens/BusinessScreen';
import { ExpertiseScreen } from './src/screens/ExpertiseScreen';
import { HomeScreen } from './src/screens/HomeScreen';

type Overlay = null | 'business' | 'expertise';

function Root() {
  const { ready, session, current, memberships } = useApp();
  const c = useTheme();
  const [overlay, setOverlay] = useState<Overlay>(null);

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.page, justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></View>;
  if (!session) return <AuthScreen />;
  if (memberships.length === 0 || overlay === 'business') return <BusinessScreen onDone={memberships.length ? () => setOverlay(null) : undefined} />;
  if (!current?.expertise_level || overlay === 'expertise') return <ExpertiseScreen onDone={current?.expertise_level ? () => setOverlay(null) : undefined} />;
  return <HomeScreen go={setOverlay} />;
}

export default function App() {
  const [loaded] = useFonts({ Newsreader_500Medium, InstrumentSans_400Regular, InstrumentSans_500Medium, IBMPlexMono_400Regular });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <AppProvider>
        <Root />
        <StatusBar style="auto" />
      </AppProvider>
    </ThemeProvider>
  );
}
