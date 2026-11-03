import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useGoals } from '../state/Goals';
import { NODE_TYPES, SUBTYPES, type NodeType } from '../lib/inventory';
import { DEFAULT_METRIC, METRICS, PERIODS, isValidDate, type Direction, type KpiMetric, type KpiPeriod } from '../lib/kpis';
import { Button, Chip, Field, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

const SIMPLE_METRICS: KpiMetric[] = ['ideas_submitted', 'ideas_approved', 'projects_shipped', 'manual'];

export function GoalFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { nodes } = useInventory();
  const { kpis, createGoal } = useGoals();
  const simple = current?.expertise_level === 'business_owner' || current?.expertise_level === 'technician';

  const [title, setTitle] = useState('');
  const [basedOn, setBasedOn] = useState<NodeType>('concept');
  const [metric, setMetric] = useState<KpiMetric>('ideas_submitted');
  const [kpiId, setKpiId] = useState<string | null>(null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [period, setPeriod] = useState<KpiPeriod>('quarter');
  const [direction, setDirection] = useState<Direction>('at_least');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState('');
  const [due, setDue] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metrics = simple ? SIMPLE_METRICS : METRICS;
  const targetNum = Number(target.replace(',', '.'));
  const valid = title.trim() && target.trim() !== '' && Number.isFinite(targetNum) && (!due || isValidDate(due));
  const linkable = nodes.filter((n) => n.type === basedOn && n.subtype !== 'idea').slice(0, 12);

  const chooseType = (ty: NodeType) => { setBasedOn(ty); setMetric(DEFAULT_METRIC[ty]); setSubtype(null); setPicked([]); };

  const save = async () => {
    setBusy(true); setError(null);
    try {
      const id = await createGoal({
        title: title.trim(), description: null, based_on: basedOn, target_value: targetNum, direction, due_date: due || null, nodeIds: picked,
        kpiId: kpiId ?? undefined,
        newKpi: kpiId ? undefined : { name: title.trim(), metric, scope_type: metric === 'inventory_count' ? basedOn : null, scope_subtype: metric === 'inventory_count' ? subtype : null, period, unit: metric === 'manual' ? unit.trim() || null : null },
      });
      onDone(id);
    } catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Page>
      <View style={{ gap: space[2] }}>
        <Text variant="h2">{t('goals.formTitle')}</Text>
        <Text variant="secondary">{t('goals.formHint')}</Text>
      </View>

      <Field label={t('goals.fieldTitle')} value={title} onChangeText={setTitle} maxLength={200} placeholder={t('goals.fieldTitlePlaceholder')} />

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('goals.basedOn')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {NODE_TYPES.map((ty) => <Chip key={ty} label={t(`goals.basedOnType.${ty}`)} selected={basedOn === ty} onPress={() => chooseType(ty)} />)}
        </View>
      </View>

      {!simple && kpis.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.useExistingKpi')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            <Chip label={t('goals.newMeasure')} selected={kpiId === null} onPress={() => setKpiId(null)} />
            {kpis.map((k) => <Chip key={k.id} label={k.name} selected={kpiId === k.id} onPress={() => setKpiId(k.id)} />)}
          </View>
        </View>
      )}

      {kpiId === null && (
        <>
          <View style={{ gap: space[3] }}>
            <Text variant="overline">{t('goals.measure')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
              {metrics.map((m) => <Chip key={m} label={t(`metric.${m}.name`)} selected={metric === m} onPress={() => setMetric(m)} />)}
            </View>
            <Text variant="secondary">{t(`metric.${metric}.hint`)}</Text>
          </View>
          {metric === 'inventory_count' && (
            <View style={{ gap: space[3] }}>
              <Text variant="overline">{t('goals.countOnly')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
                <Chip label={t('goals.allOfType')} selected={subtype === null} onPress={() => setSubtype(null)} />
                {SUBTYPES[basedOn].map((s) => <Chip key={s} label={t(`subtype.${s}`)} selected={subtype === s} onPress={() => setSubtype(s)} />)}
              </View>
            </View>
          )}
          {metric === 'manual' && !simple && <Field label={t('goals.unit')} value={unit} onChangeText={setUnit} maxLength={30} placeholder={t('goals.unitPlaceholder')} />}
          {metric !== 'manual' && metric !== 'projects_active' && metric !== 'idea_score_avg' && (
            <View style={{ gap: space[3] }}>
              <Text variant="overline">{t('goals.period')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
                {PERIODS.map((p) => <Chip key={p} label={t(`period.${p}`)} selected={period === p} onPress={() => setPeriod(p)} />)}
              </View>
            </View>
          )}
        </>
      )}

      {!simple && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.direction')}</Text>
          <View style={{ flexDirection: 'row', gap: space[3] }}>
            <Chip label={t('goals.atLeast')} selected={direction === 'at_least'} onPress={() => setDirection('at_least')} />
            <Chip label={t('goals.atMost')} selected={direction === 'at_most'} onPress={() => setDirection('at_most')} />
          </View>
        </View>
      )}

      <Field label={t('goals.target')} value={target} onChangeText={setTarget} keyboardType="numeric" />
      <Field label={t('goals.due')} value={due} onChangeText={setDue} placeholder="YYYY-MM-DD" maxLength={10} />

      {!simple && linkable.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.linkedItems')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {linkable.map((n) => <Chip key={n.id} label={n.title} selected={picked.includes(n.id)} onPress={() => setPicked((p) => (p.includes(n.id) ? p.filter((x) => x !== n.id) : [...p, n.id]))} />)}
          </View>
        </View>
      )}

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('goals.create')} onPress={save} loading={busy} disabled={!valid} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
