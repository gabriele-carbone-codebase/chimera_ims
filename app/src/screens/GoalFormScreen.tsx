import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useGoals } from '../state/Goals';
import { NODE_TYPES, SUBTYPES, type NodeType } from '../lib/inventory';
import { isSimple } from '../lib/levels';
import { DEFAULT_METRIC, METRICS, PERIODS, isValidDate, periodEnd, type Direction, type KpiMetric, type KpiPeriod } from '../lib/kpis';
import { BackButton, Button, Chip, ChipRow, Field, Header, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

const SIMPLE_METRICS: KpiMetric[] = ['ideas_submitted', 'ideas_approved', 'projects_shipped', 'manual'];

export function GoalFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { nodes } = useInventory();
  const { kpis, createGoal } = useGoals();
  const simple = isSimple(current?.expertise_level);

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
  // SMART: a goal needs a number, a unit of measure and a deadline.
  const unitText = kpiId ? kpis.find((k) => k.id === kpiId)?.unit ?? '' : metric === 'manual' ? unit.trim() : t(`metric.${metric}.unit`);
  const valid = title.trim() && target.trim() !== '' && Number.isFinite(targetNum) && isValidDate(due) && (kpiId !== null || metric !== 'manual' || !!unit.trim());
  const [step, setStep] = useState(1);
  const STEPS = 4;
  const stepOk = [true, !!title.trim(), true, target.trim() !== '' && Number.isFinite(targetNum) && (kpiId !== null || metric !== 'manual' || !!unit.trim()), !!valid][step];
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
      <BackButton onBack={step === 1 ? onCancel : () => setStep(step - 1)} />
      <Header title={t(`goals.step${step}.title`)} hint={t(`goals.step${step}.hint`)} size="h2" />
      <Text variant="overline">{t('goals.stepOf', { n: step, total: STEPS })}</Text>

      {step === 1 && (
        <>
          <Field label={t('goals.fieldTitle')} value={title} onChangeText={setTitle} maxLength={200} placeholder={t('goals.fieldTitlePlaceholder')} />
          <View style={{ gap: space[3] }}>
            <Text variant="overline">{t('goals.basedOn')}</Text>
            <ChipRow kind="radio">
              {NODE_TYPES.map((ty) => <Chip key={ty} label={t(`goals.basedOnType.${ty}`)} selected={basedOn === ty} onPress={() => chooseType(ty)} />)}
            </ChipRow>
          </View>
        </>
      )}

      {step === 2 && !simple && kpis.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.useExistingKpi')}</Text>
          <ChipRow kind="radio">
            <Chip label={t('goals.newMeasure')} selected={kpiId === null} onPress={() => setKpiId(null)} />
            {kpis.map((k) => <Chip key={k.id} label={k.name} selected={kpiId === k.id} onPress={() => setKpiId(k.id)} />)}
          </ChipRow>
        </View>
      )}

      {step === 2 && kpiId === null && (
        <>
          <View style={{ gap: space[3] }}>
            <Text variant="overline">{t('goals.measure')}</Text>
            <ChipRow kind="radio">
              {metrics.map((m) => <Chip key={m} label={t(`metric.${m}.name`)} selected={metric === m} onPress={() => setMetric(m)} />)}
            </ChipRow>
            <Text variant="secondary">{t(`metric.${metric}.hint`)}</Text>
          </View>
          {metric === 'inventory_count' && (
            <View style={{ gap: space[3] }}>
              <Text variant="overline">{t('goals.countOnly')}</Text>
              <ChipRow kind="radio">
                <Chip label={t('goals.allOfType')} selected={subtype === null} onPress={() => setSubtype(null)} />
                {SUBTYPES[basedOn].map((s) => <Chip key={s} label={t(`subtype.${s}`)} selected={subtype === s} onPress={() => setSubtype(s)} />)}
              </ChipRow>
            </View>
          )}
          {metric !== 'manual' && metric !== 'projects_active' && metric !== 'idea_score_avg' && (
            <View style={{ gap: space[3] }}>
              <Text variant="overline">{t('goals.period')}</Text>
              <ChipRow kind="radio">
                {PERIODS.map((p) => <Chip key={p} label={t(`period.${p}`)} selected={period === p} onPress={() => setPeriod(p)} />)}
              </ChipRow>
            </View>
          )}
        </>
      )}

      {step === 3 && !simple && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.direction')}</Text>
          <ChipRow kind="radio">
            <Chip label={t('goals.atLeast')} selected={direction === 'at_least'} onPress={() => setDirection('at_least')} />
            <Chip label={t('goals.atMost')} selected={direction === 'at_most'} onPress={() => setDirection('at_most')} />
          </ChipRow>
        </View>
      )}

      {step === 3 && (
        <>
          <Field label={unitText ? `${t('goals.target')} (${unitText})` : t('goals.target')} value={target} onChangeText={setTarget} inputMode="decimal" />
          {metric === 'manual' && kpiId === null && <Field label={t('goals.unit')} value={unit} onChangeText={setUnit} maxLength={30} placeholder={t('goals.unitPlaceholder')} />}
        </>
      )}
      {step === 4 && (
      <View style={{ gap: space[3] }}>
        <Field label={t('goals.due')} value={due} onChangeText={setDue} placeholder={t('goals.duePlaceholder')} maxLength={10} />
        <ChipRow>
          {(['month', 'quarter', 'year'] as const).map((p) => <Chip key={p} label={t(`goals.endOf.${p}`)} selected={due === periodEnd(p)} onPress={() => setDue(periodEnd(p))} />)}
        </ChipRow>
        {!!due && !isValidDate(due) && <Text variant="error">{t('goals.dueInvalid')}</Text>}
      </View>
      )}

      {step === 4 && !simple && linkable.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('goals.linkedItems')}</Text>
          <ChipRow kind="checkbox">
            {linkable.map((n) => <Chip key={n.id} label={n.title} selected={picked.includes(n.id)} onPress={() => setPicked((p) => (p.includes(n.id) ? p.filter((x) => x !== n.id) : [...p, n.id]))} />)}
          </ChipRow>
        </View>
      )}

      {step === 4 && !!valid && <Text variant="secondary">{t('goals.summary', { title: title.trim(), target, unit: unitText, due })}</Text>}
      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        {step < STEPS
          ? <Button label={t('goals.next')} onPress={() => setStep(step + 1)} disabled={!stepOk} />
          : <Button label={t('goals.create')} onPress={save} loading={busy} disabled={!valid} />}
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
