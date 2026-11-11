import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useGoals } from '../state/Goals';
import { NODE_TYPES, SUBTYPES, canManageAll, type NodeType } from '../lib/inventory';
import { METRICS, PERIODS, type KpiMetric, type KpiPeriod } from '../lib/kpis';
import { BackButton, Button, Card, Chip, ChipRow, ConfirmButton, Field, Header, NotFound, Page, Text, ViewOnly, useAction } from '../components/ui';
import { MiniBars, fmt } from '../components/charts';
import { space } from '../theme/tokens';

export function KpiFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { createKpi } = useGoals();
  const [name, setName] = useState('');
  const [metric, setMetric] = useState<KpiMetric>('ideas_submitted');
  const [scopeType, setScopeType] = useState<NodeType>('concept');
  const [subtype, setSubtype] = useState<string | null>(null);
  const [period, setPeriod] = useState<KpiPeriod>('quarter');
  const [unit, setUnit] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true); setError(null);
    try {
      onDone(await createKpi({ name: name.trim(), metric, period, scope_type: metric === 'inventory_count' ? scopeType : null, scope_subtype: metric === 'inventory_count' ? subtype : null, unit: metric === 'manual' ? unit.trim() || null : null }));
    } catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Page>
      <BackButton onBack={onCancel} />
      <Header title={t('goals.kpiFormTitle')} hint={t('goals.kpiFormHint')} size="h2" />
      <Field label={t('goals.kpiName')} value={name} onChangeText={setName} maxLength={200} />
      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('goals.measure')}</Text>
        <ChipRow kind="radio">
          {METRICS.map((m) => <Chip key={m} label={t(`metric.${m}.name`)} selected={metric === m} onPress={() => setMetric(m)} />)}
        </ChipRow>
        <Text variant="secondary">{t(`metric.${metric}.hint`)}</Text>
      </View>
      {metric === 'inventory_count' && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.countOnly')}</Text>
          <ChipRow kind="radio">
            {NODE_TYPES.map((ty) => <Chip key={ty} label={t(`typePlural.${ty}`)} selected={scopeType === ty} onPress={() => { setScopeType(ty); setSubtype(null); }} />)}
          </ChipRow>
          <ChipRow kind="radio">
            <Chip label={t('goals.allOfType')} selected={subtype === null} onPress={() => setSubtype(null)} />
            {SUBTYPES[scopeType].map((s) => <Chip key={s} label={t(`subtype.${s}`)} selected={subtype === s} onPress={() => setSubtype(s)} />)}
          </ChipRow>
        </View>
      )}
      {metric === 'manual' && <Field label={t('goals.unit')} value={unit} onChangeText={setUnit} maxLength={30} placeholder={t('goals.unitPlaceholder')} />}
      {metric !== 'manual' && metric !== 'projects_active' && metric !== 'idea_score_avg' && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.period')}</Text>
          <ChipRow kind="radio">
            {PERIODS.map((p) => <Chip key={p} label={t(`period.${p}`)} selected={period === p} onPress={() => setPeriod(p)} />)}
          </ChipRow>
        </View>
      )}
      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('goals.createKpi')} onPress={save} loading={busy} disabled={!name.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}

/** Card to record a new value for a manual KPI. */
export function ManualValueCard({ onSave }: { onSave: (value: number) => Promise<void> }) {
  const { t } = useTranslation();
  const { busy, error, run } = useAction();
  const [text, setText] = useState('');
  const value = Number(text.replace(',', '.'));
  return (
    <Card>
      <Text variant="h3">{t('goals.recordValue')}</Text>
      <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}><Field label={t('goals.newValue')} value={text} onChangeText={setText} inputMode="decimal" /></View>
        <Button label={t('form.save')} loading={busy !== null} disabled={text.trim() === '' || !Number.isFinite(value)} onPress={() => run('save', async () => { await onSave(value); setText(''); })} />
      </View>
      {error && <Text variant="error">{error}</Text>}
    </Card>
  );
}

export function KpiDetailScreen({ id, onBack, onOpenGoal }: { id: string; onBack: () => void; onOpenGoal: (id: string) => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { kpis, goals, snapshots, valueOf, recordManual, deleteKpi } = useGoals();
  const kpi = kpis.find((k) => k.id === id);
  const [error, setError] = useState<string | null>(null);

  if (!kpi || !current) return <NotFound message={t('goals.notFound')} onBack={onBack} />;

  const manager = canManageAll(current.role);
  const unit = kpi.unit ?? t(`metric.${kpi.metric}.unit`);
  const history = snapshots.filter((s) => s.kpi_id === id);
  const used = goals.filter((g) => g.kpi_id === id);
  const run = async (fn: () => Promise<void>) => { setError(null); try { await fn(); } catch (e: any) { setError(e?.message ?? t('common.error')); } };

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t(`metric.${kpi.metric}.name`)} · {t(`period.${kpi.period}`)}</Text>
        <Text variant="h1">{kpi.name}</Text>
        <Text variant="h2">{fmt(valueOf(id))} <Text variant="secondary">{unit}</Text></Text>
        <Text variant="secondary">{t(`metric.${kpi.metric}.hint`)}</Text>
      </View>
      {error && <Text variant="error">{error}</Text>}

      {history.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.history')}</Text>
          <MiniBars points={history.map((s) => ({ label: s.snap_date.slice(5), value: s.value }))} />
        </View>
      )}

      {kpi.metric === 'manual' && manager && <ManualValueCard onSave={(v) => recordManual(id, v)} />}

      {used.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.usedByGoals')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {used.map((g) => <Chip key={g.id} label={g.title} onPress={() => onOpenGoal(g.id)} />)}
          </View>
        </View>
      )}

      {manager ? <ConfirmButton label={t('goals.deleteKpi')} message={t('goals.deleteKpiConfirm')} onConfirm={() => run(async () => { await deleteKpi(id); onBack(); })} style={{ alignSelf: 'flex-start' }} /> : <ViewOnly />}
    </Page>
  );
}
