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
import { InventoryProvider } from './src/state/Inventory';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppBar, type Section } from './src/components/AppBar';
import { AuthScreen } from './src/screens/AuthScreen';
import { BusinessScreen } from './src/screens/BusinessScreen';
import { ExpertiseScreen } from './src/screens/ExpertiseScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { NodeFormScreen } from './src/screens/NodeFormScreen';
import { NodeDetailScreen } from './src/screens/NodeDetailScreen';
import type { NodeType } from './src/lib/inventory';

type Overlay = null | 'business' | 'expertise';
type Route =
  | { name: 'home' }
  | { name: 'inventory' }
  | { name: 'node'; id: string }
  | { name: 'form'; id?: string; type: NodeType };

function Main({ overlay, setOverlay }: { overlay: Overlay; setOverlay: (o: Overlay) => void }) {
  const { current } = useApp();
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const [tab, setTab] = useState<NodeType>('person');
  const route = stack[stack.length - 1];
  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const goSection = (s: Section) => setStack([{ name: s }]);
  const section = stack[0].name as Section;

  return (
    <View style={{ flex: 1 }}>
      <AppBar section={section} onSection={goSection} business={current?.business.name ?? ''} />
      {route.name === 'home' && <HomeScreen go={setOverlay} />}
      {route.name === 'inventory' && (
        <InventoryScreen tab={tab} onTab={setTab} onOpen={(id) => push({ name: 'node', id })} onAdd={(type) => push({ name: 'form', type })} />
      )}
      {route.name === 'node' && (
        <NodeDetailScreen id={route.id} onOpen={(id) => push({ name: 'node', id })} onEdit={() => push({ name: 'form', id: route.id, type: tab })} onBack={pop} />
      )}
      {route.name === 'form' && (
        <NodeFormScreen
          id={route.id}
          initialType={route.type}
          onCancel={pop}
          onDone={(id) => (route.id ? pop() : setStack((s) => [...s.slice(0, -1), { name: 'node', id }]))}
        />
      )}
    </View>
  );
}

function Root() {
  const { ready, session, current, memberships } = useApp();
  const c = useTheme();
  const [overlay, setOverlay] = useState<Overlay>(null);

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.page, justifyContent: 'center' }}><ActivityIndicator color={c.accent} /></View>;
  if (!session) return <AuthScreen />;
  if (memberships.length === 0 || overlay === 'business') return <BusinessScreen onDone={memberships.length ? () => setOverlay(null) : undefined} />;
  if (!current?.expertise_level || overlay === 'expertise') return <ExpertiseScreen onDone={current?.expertise_level ? () => setOverlay(null) : undefined} />;
  return (
    <InventoryProvider key={current.business_id}>
      <Main overlay={overlay} setOverlay={setOverlay} />
    </InventoryProvider>
  );
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
