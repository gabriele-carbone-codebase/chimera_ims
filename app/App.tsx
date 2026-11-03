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
import { IdeasProvider } from './src/state/Ideas';
import { ProjectsProvider } from './src/state/Projects';
import { ProgramsProvider } from './src/state/Programs';
import { ProgramsScreen } from './src/screens/ProgramsScreen';
import { ProgramNewScreen } from './src/screens/ProgramNewScreen';
import { ProgramDetailScreen } from './src/screens/ProgramDetailScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { ProjectFormScreen } from './src/screens/ProjectFormScreen';
import { ProjectDetailScreen } from './src/screens/ProjectDetailScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppShell, type Section } from './src/components/AppBar';
import { AuthScreen } from './src/screens/AuthScreen';
import { BusinessScreen } from './src/screens/BusinessScreen';
import { ExpertiseScreen } from './src/screens/ExpertiseScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { NodeFormScreen } from './src/screens/NodeFormScreen';
import { NodeDetailScreen } from './src/screens/NodeDetailScreen';
import { IdeasScreen } from './src/screens/IdeasScreen';
import { IdeaFormScreen } from './src/screens/IdeaFormScreen';
import { IdeaDetailScreen } from './src/screens/IdeaDetailScreen';
import type { NodeType } from './src/lib/inventory';

type Overlay = null | 'business' | 'expertise';
type Route =
  | { name: 'home' }
  | { name: 'programs' }
  | { name: 'program'; id: string }
  | { name: 'programNew' }
  | { name: 'ideas' }
  | { name: 'idea'; id: string }
  | { name: 'ideaForm' }
  | { name: 'projects' }
  | { name: 'project'; id: string }
  | { name: 'projectForm' }
  | { name: 'inventory' }
  | { name: 'node'; id: string }
  | { name: 'form'; id?: string; type: NodeType };

function Main({ setOverlay }: { setOverlay: (o: Overlay) => void }) {
  const { current } = useApp();
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const [tab, setTab] = useState<NodeType>('person');
  const route = stack[stack.length - 1];
  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const replaceTop = (r: Route) => setStack((s) => [...s.slice(0, -1), r]);
  const goSection = (s: Section) => setStack([{ name: s }]);
  const section = stack[0].name as Section;

  return (
    <AppShell section={section} onSection={goSection} business={current?.business.name ?? ''}>
      {route.name === 'home' && <HomeScreen go={setOverlay} />}

      {route.name === 'programs' && <ProgramsScreen onOpen={(id) => push({ name: 'program', id })} onNew={() => push({ name: 'programNew' })} />}
      {route.name === 'programNew' && <ProgramNewScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'program', id })} />}
      {route.name === 'program' && <ProgramDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} />}

      {route.name === 'ideas' && <IdeasScreen onOpen={(id) => push({ name: 'idea', id })} onPropose={() => push({ name: 'ideaForm' })} />}
      {route.name === 'ideaForm' && <IdeaFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'idea', id })} />}
      {route.name === 'idea' && <IdeaDetailScreen id={route.id} onBack={pop} onOpenProject={(id) => setStack([{ name: 'projects' }, { name: 'project', id }])} />}

      {route.name === 'projects' && <ProjectsScreen onOpen={(id) => push({ name: 'project', id })} onNew={() => push({ name: 'projectForm' })} />}
      {route.name === 'projectForm' && <ProjectFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'project', id })} />}
      {route.name === 'project' && (
        <ProjectDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} onOpenIdea={(id) => setStack([{ name: 'ideas' }, { name: 'idea', id }])} />
      )}

      {route.name === 'inventory' && (
        <InventoryScreen tab={tab} onTab={setTab} onOpen={(id) => push({ name: 'node', id })} onAdd={(type) => push({ name: 'form', type })} />
      )}
      {route.name === 'node' && (
        <NodeDetailScreen id={route.id} onOpen={(id) => push({ name: 'node', id })} onEdit={() => push({ name: 'form', id: route.id, type: tab })} onBack={pop} />
      )}
      {route.name === 'form' && (
        <NodeFormScreen id={route.id} initialType={route.type} onCancel={pop} onDone={(id) => (route.id ? pop() : replaceTop({ name: 'node', id }))} />
      )}
    </AppShell>
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
      <IdeasProvider>
        <ProjectsProvider>
          <ProgramsProvider>
            <Main setOverlay={setOverlay} />
          </ProgramsProvider>
        </ProjectsProvider>
      </IdeasProvider>
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
