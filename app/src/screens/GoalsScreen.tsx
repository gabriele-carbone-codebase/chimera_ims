import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useGoals } from '../state/Goals';
import { canManageAll } from '../lib/inventory';
import { Button, Card, Chip, Page, Text } from '../components/ui';
import { ProgressBar, fmt } from '../components/charts';
import { space } from '../theme/tokens';

export function GoalsScreen({ onOpenGoal, onNewGoal, onOpenKpi, onNewKpi }: { onOpenGoal: (id: string) => void; onNewGoal: () => void; onOpenKpi: (id: string) => void; onNewKpi: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { goals, kpis, valueOf, stateOf, progressOf, loading } = useGoals();
  const [tab, setTab] = useState<'goals' | 'kpis'>('goals');
  const manager = current ? canManageAll(current.role) : false;
  const simple = current?.expertise_level === 'business_owner' || current?.expertise_level === 'technician';
  const unitOf = (id: string | null) => { const k = kpis.find((x) => x.id === id); return k?.unit ?? (k ? t(`metric.${k.metric}.unit`) : ''); };

  return (
    <Page>
      <View style={{ gap: space[2] }}>
        <Text variant="h1">{t('goals.title')}</Text>
        <Text variant="secondary">{t('goals.hint')}</Text>
      </View>

      {!simple && (
        <View style={{ flexDirection: 'row', gap: space[3] }}>
          <Chip label={`${t('goals.goalsTab')} · ${goals.length}`} selected={tab === 'goals'} onPress={() => setTab('goals')} />
          <Chip label={`${t('goals.kpisTab')} · ${kpis.length}`} selected={tab === 'kpis'} onPress={() => setTab('kpis')} />
        </View>
      )}

      {manager && <Button label={tab === 'goals' ? t('goals.newGoal') : t('goals.newKpi')} onPress={tab === 'goals' ? onNewGoal : onNewKpi} style={{ alignSelf: 'flex-start' }} />}

      {loading ? <Text variant="secondary">{t('common.loading')}</Text> : tab === 'goals' ? (
        goals.length === 0 ? (
          <Card><Text variant="h3">{t('goals.empty')}</Text><Text variant="secondary">{t('goals.emptyHint')}</Text></Card>
        ) : (
          <View style={{ gap: space[4] }}>
            {goals.map((g) => {
              const st = stateOf(g);
              return (
                <Card key={g.id} onPress={() => onOpenGoal(g.id)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4] }}>
                    <Text variant="h3" style={{ flex: 1 }}>{g.title}</Text>
                    <Text variant="overline">{t(`goalState.${st}`)}</Text>
                  </View>
                  <ProgressBar value={progressOf(g)} tone={st === 'achieved' ? 'done' : st === 'at_risk' || st === 'overdue' ? 'risk' : 'ok'} />
                  <Text variant="overline">
                    {fmt(valueOf(g.kpi_id))} / {g.direction === 'at_most' ? '≤ ' : ''}{fmt(g.target_value)} {unitOf(g.kpi_id)}{g.due_date ? ` · ${g.due_date}` : ''}
                  </Text>
                </Card>
              );
            })}
          </View>
        )
      ) : kpis.length === 0 ? (
        <Card><Text variant="h3">{t('goals.emptyKpis')}</Text><Text variant="secondary">{t('goals.emptyKpisHint')}</Text></Card>
      ) : (
        <View style={{ gap: space[4] }}>
          {kpis.map((k) => (
            <Card key={k.id} onPress={() => onOpenKpi(k.id)}>
              <Text variant="h3">{k.name}</Text>
              <Text variant="overline">{t(`metric.${k.metric}.name`)} · {t(`period.${k.period}`)}</Text>
              <Text variant="h2">{fmt(valueOf(k.id))} <Text variant="secondary">{k.unit ?? t(`metric.${k.metric}.unit`)}</Text></Text>
            </Card>
          ))}
        </View>
      )}
    </Page>
  );
}
