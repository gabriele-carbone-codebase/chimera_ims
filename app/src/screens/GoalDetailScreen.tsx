import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useGoals } from '../state/Goals';
import { canManageAll } from '../lib/inventory';
import { Button, Card, Chip, Field, Page, Text } from '../components/ui';
import { MiniBars, ProgressBar, fmt } from '../components/charts';
import { space } from '../theme/tokens';

export function GoalDetailScreen({ id, onBack, onOpenNode, onOpenKpi }: { id: string; onBack: () => void; onOpenNode: (id: string) => void; onOpenKpi: (id: string) => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { goals, kpis, goalNodes, snapshots, valueOf, stateOf, progressOf, recordManual, setGoalStatus, deleteGoal } = useGoals();
  const goal = goals.find((g) => g.id === id);
  const [manual, setManual] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!goal || !current) return <Page><Text variant="secondary">{t('goals.notFound')}</Text><Button variant="secondary" label={t('common.back')} onPress={onBack} /></Page>;

  const manager = canManageAll(current.role);
  const kpi = kpis.find((k) => k.id === goal.kpi_id);
  const st = stateOf(goal);
  const unit = kpi?.unit ?? (kpi ? t(`metric.${kpi.metric}.unit`) : '');
  const history = snapshots.filter((s) => s.kpi_id === goal.kpi_id).map((s) => ({ label: s.snap_date.slice(5), value: s.value }));
  const linked = goalNodes.filter((g) => g.goal_id === id).map((g) => byId[g.node_id]).filter(Boolean);

  const run = async (fn: () => Promise<void>) => { setError(null); try { await fn(); } catch (e: any) { setError(e?.message ?? t('common.error')); } };

  return (
    <Page>
      <Button variant="ghost" label={`← ${t('common.back')}`} onPress={onBack} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t(`goalState.${st}`)} · {t(`goals.basedOnType.${goal.based_on}`)}</Text>
        <Text variant="h1">{goal.title}</Text>
      </View>
      {error && <Text variant="error">{error}</Text>}

      <Card>
        <Text variant="h2">{fmt(valueOf(goal.kpi_id))} <Text variant="secondary">/ {goal.direction === 'at_most' ? '≤ ' : ''}{fmt(goal.target_value)} {unit}</Text></Text>
        <ProgressBar value={progressOf(goal)} tone={st === 'achieved' ? 'done' : st === 'at_risk' || st === 'overdue' ? 'risk' : 'ok'} />
        <Text variant="overline">{t('goals.started')} {goal.start_date}{goal.due_date ? ` · ${t('goals.dueOn')} ${goal.due_date}` : ''}</Text>
        {kpi && <Button variant="ghost" label={`${t('goals.measuredBy')}: ${kpi.name}`} onPress={() => onOpenKpi(kpi.id)} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />}
      </Card>

      {history.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.history')}</Text>
          <MiniBars points={history} />
        </View>
      )}

      {kpi?.metric === 'manual' && manager && (
        <Card>
          <Text variant="h3">{t('goals.recordValue')}</Text>
          <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}><Field label={t('goals.newValue')} value={manual} onChangeText={setManual} keyboardType="numeric" /></View>
            <Button label={t('form.save')} disabled={!Number.isFinite(Number(manual.replace(',', '.'))) || manual.trim() === ''} onPress={() => run(async () => { await recordManual(kpi.id, Number(manual.replace(',', '.'))); setManual(''); })} />
          </View>
        </Card>
      )}

      {linked.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.linkedItems')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {linked.map((n) => <Chip key={n.id} label={n.title} onPress={() => onOpenNode(n.id)} />)}
          </View>
        </View>
      )}

      {manager && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {goal.status === 'active' ? (
            <>
              <Button variant="secondary" label={t('goals.markAchieved')} onPress={() => run(() => setGoalStatus(id, 'achieved'))} />
              <Button variant="ghost" label={t('goals.archive')} onPress={() => run(() => setGoalStatus(id, 'archived'))} />
            </>
          ) : <Button variant="secondary" label={t('goals.reopen')} onPress={() => run(() => setGoalStatus(id, 'active'))} />}
          <Button variant="ghost" label={confirming ? t('goals.confirmDelete') : t('goals.delete')} onPress={() => (confirming ? run(async () => { await deleteGoal(id); onBack(); }) : setConfirming(true))} />
        </View>
      )}
    </Page>
  );
}
