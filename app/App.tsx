import i18n from './src/i18n';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
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
import { GoalsProvider } from './src/state/Goals';
import { StrategyProvider } from './src/state/Strategy';
import { NotificationsProvider, useNotifications, type Target } from './src/state/Notifications';
import { Button, Screen, Text } from './src/components/ui';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppShell, type Section } from './src/components/AppBar';
import { AuthScreen } from './src/screens/AuthScreen';
import { BusinessScreen } from './src/screens/BusinessScreen';
import { ExpertiseScreen } from './src/screens/ExpertiseScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { NodeFormScreen } from './src/screens/NodeFormScreen';
import { NodeDetailScreen } from './src/screens/NodeDetailScreen';
import { IdeasScreen } from './src/screens/IdeasScreen';
import { IdeaFormScreen } from './src/screens/IdeaFormScreen';
import { IdeaDetailScreen } from './src/screens/IdeaDetailScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { ProjectFormScreen } from './src/screens/ProjectFormScreen';
import { ProjectDetailScreen } from './src/screens/ProjectDetailScreen';
import { ProgramsScreen } from './src/screens/ProgramsScreen';
import { ProgramNewScreen } from './src/screens/ProgramNewScreen';
import { ProgramDetailScreen } from './src/screens/ProgramDetailScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { GoalsScreen } from './src/screens/GoalsScreen';
import { GoalFormScreen } from './src/screens/GoalFormScreen';
import { GoalDetailScreen } from './src/screens/GoalDetailScreen';
import { KpiDetailScreen, KpiFormScreen } from './src/screens/KpiScreens';
import { StrategyHubScreen } from './src/screens/StrategyHubScreen';
import { AssumptionDetailScreen, AssumptionFormScreen } from './src/screens/AssumptionScreens';
import { StrategyDetailScreen } from './src/screens/StrategyDetailScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import type { NodeType } from './src/lib/inventory';
import { isAdvanced } from './src/lib/levels';

type Overlay = null | 'business' | 'expertise';
type Route =
  | { name: 'home' }
  | { name: 'notifications' }
  | { name: 'settings' }
  | { name: 'goals' }
  | { name: 'goal'; id: string }
  | { name: 'goalNew' }
  | { name: 'kpi'; id: string }
  | { name: 'kpiNew' }
  | { name: 'programs' }
  | { name: 'program'; id: string }
  | { name: 'programNew' }
  | { name: 'activity'; program: string; id: string }
  | { name: 'ideas' }
  | { name: 'idea'; id: string }
  | { name: 'ideaForm' }
  | { name: 'projects' }
  | { name: 'project'; id: string }
  | { name: 'projectForm' }
  | { name: 'inventory' }
  | { name: 'node'; id: string }
  | { name: 'form'; id?: string; type: NodeType }
  | { name: 'strategy' }
  | { name: 'assumption'; id: string }
  | { name: 'assumptionNew' }
  | { name: 'strategyVersion'; id: string };

function Main({ setOverlay }: { setOverlay: (o: Overlay) => void }) {
  const { current } = useApp();
  const { count, items } = useNotifications();
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const [tab, setTab] = useState<NodeType>('person');
  const route = stack[stack.length - 1];
  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const replaceTop = (r: Route) => setStack((s) => [...s.slice(0, -1), r]);
  const goSection = (s: Section) => setStack([{ name: s }]);
  const section = stack[0].name as Section;

  // Hardware back (Android) pops the stack; at the root it falls through to the system.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length <= 1) return false;
      pop();
      return true;
    });
    return () => sub.remove();
  }, [stack.length]);

  // The strategy layer (field, assumptions, strategy versions) is for specialists and managers.
  const sections: Section[] = ['home', 'notifications', 'goals', 'programs', 'ideas', 'projects', 'inventory', ...(isAdvanced(current?.expertise_level) ? (['strategy'] as Section[]) : []), 'settings'];

  // Cross-links push, so Back returns to where the user came from.
  const openTarget = (t: Target) => {
    if (t.type === 'idea') push({ name: 'idea', id: t.id });
    else if (t.type === 'project') push({ name: 'project', id: t.id });
    else if (t.type === 'goal') push({ name: 'goal', id: t.id });
    else if (t.type === 'assumption') push({ name: 'assumption', id: t.id });
    else push({ name: 'strategyVersion', id: t.id });
  };

  return (
    <AppShell section={section} sections={sections} badges={{ notifications: count }} onSection={goSection}>
      {route.name === 'settings' && <SettingsScreen go={setOverlay} />}
      {route.name === 'home' && <HomeScreen attention={items.slice(0, 3)} onOpenTarget={openTarget} onSeeAll={() => goSection('notifications')} />}
      {route.name === 'notifications' && <NotificationsScreen onOpen={openTarget} />}

      {route.name === 'goals' && <GoalsScreen onOpenGoal={(id) => push({ name: 'goal', id })} onNewGoal={() => push({ name: 'goalNew' })} onOpenKpi={(id) => push({ name: 'kpi', id })} onNewKpi={() => push({ name: 'kpiNew' })} />}
      {route.name === 'goalNew' && <GoalFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'goal', id })} />}
      {route.name === 'goal' && <GoalDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} onOpenKpi={(id) => push({ name: 'kpi', id })} />}
      {route.name === 'kpiNew' && <KpiFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'kpi', id })} />}
      {route.name === 'kpi' && <KpiDetailScreen id={route.id} onBack={pop} onOpenGoal={(id) => push({ name: 'goal', id })} />}

      {route.name === 'programs' && <ProgramsScreen onOpen={(id) => push({ name: 'program', id })} onNew={() => push({ name: 'programNew' })} />}
      {route.name === 'programNew' && <ProgramNewScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'program', id })} />}
      {route.name === 'program' && <ProgramDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} onOpenActivity={(id) => push({ name: 'activity', program: route.id, id })} />}
      {route.name === 'activity' && <ActivityScreen key={route.id} programId={route.program} id={route.id} onBack={pop} onOpenActivity={(id) => replaceTop({ name: 'activity', program: route.program, id })} onOpenNode={(id) => push({ name: 'node', id })} />}

      {route.name === 'ideas' && <IdeasScreen onOpen={(id) => push({ name: 'idea', id })} onPropose={() => push({ name: 'ideaForm' })} />}
      {route.name === 'ideaForm' && <IdeaFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'idea', id })} />}
      {route.name === 'idea' && <IdeaDetailScreen id={route.id} onBack={pop} onOpenProject={(id) => push({ name: 'project', id })} />}

      {route.name === 'projects' && <ProjectsScreen onOpen={(id) => push({ name: 'project', id })} onNew={() => push({ name: 'projectForm' })} />}
      {route.name === 'projectForm' && <ProjectFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'project', id })} />}
      {route.name === 'project' && (
        <ProjectDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} onOpenIdea={(id) => push({ name: 'idea', id })} />
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

      {route.name === 'strategy' && (
        <StrategyHubScreen onOpenAssumption={(id) => push({ name: 'assumption', id })} onNewAssumption={() => push({ name: 'assumptionNew' })}
          onOpenStrategy={(id) => push({ name: 'strategyVersion', id })} onOpenNode={(id) => push({ name: 'node', id })} />
      )}
      {route.name === 'assumptionNew' && <AssumptionFormScreen onCancel={pop} onDone={(id) => replaceTop({ name: 'assumption', id })} />}
      {route.name === 'assumption' && <AssumptionDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} />}
      {route.name === 'strategyVersion' && (
        <StrategyDetailScreen id={route.id} onBack={pop} onOpenNode={(id) => push({ name: 'node', id })} onOpenAssumption={(id) => push({ name: 'assumption', id })} />
      )}
    </AppShell>
  );
}

function Splash() {
  const c = useTheme();
  return <View style={{ flex: 1, backgroundColor: c.page, justifyContent: 'center' }}><ActivityIndicator color={c.accent} accessibilityLabel={i18n.t('common.loading')} /></View>;
}

function Root() {
  const { t } = useTranslation();
  const { ready, session, current, memberships, loadFailed, retry, signOut } = useApp();
  const [overlay, setOverlay] = useState<Overlay>(null);

  if (!ready) return <Splash />;
  if (!session) return <AuthScreen />;
  if (loadFailed && memberships.length === 0) return <Screen><Text variant="error">{t('common.error')}</Text><Button label={t('common.retry')} onPress={retry} /><Button variant="ghost" label={t('auth.signOut')} onPress={signOut} /></Screen>;
  if (memberships.length === 0 || overlay === 'business') return <BusinessScreen onDone={memberships.length ? () => setOverlay(null) : undefined} />;
  if (!current?.expertise_level || overlay === 'expertise') return <ExpertiseScreen onDone={current?.expertise_level ? () => setOverlay(null) : undefined} />;
  return (
    <InventoryProvider key={current.business_id}>
      <IdeasProvider>
        <ProjectsProvider>
          <ProgramsProvider>
            <GoalsProvider>
              <StrategyProvider>
                <NotificationsProvider>
                  <Main setOverlay={setOverlay} />
                </NotificationsProvider>
              </StrategyProvider>
            </GoalsProvider>
          </ProgramsProvider>
        </ProjectsProvider>
      </IdeasProvider>
    </InventoryProvider>
  );
}

export default function App() {
  const [loaded, fontError] = useFonts({ Newsreader_500Medium, InstrumentSans_400Regular, InstrumentSans_500Medium, IBMPlexMono_400Regular });
  return (
    <ThemeProvider>
      {loaded || fontError ? ( // a font error falls back to system fonts instead of a blank screen
        <AppProvider>
          <Root />
          <StatusBar style="auto" />
        </AppProvider>
      ) : <Splash />}
    </ThemeProvider>
  );
}
