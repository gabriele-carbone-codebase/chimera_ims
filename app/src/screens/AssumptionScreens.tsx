import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useStrategy } from '../state/Strategy';
import { canManageAll } from '../lib/inventory';
import { ASSUMPTION_STATUSES, isDue, isFieldArtifact, type AssumptionStatus } from '../lib/strategy';
import { BackButton, Button, Card, CheckRow, Chip, ChipRow, ConfirmButton, Field, Header, NotFound, Page, Text, ViewOnly, useAction } from '../components/ui';
import { space } from '../theme/tokens';

const INTERVALS = [30, 90, 180, 365];

/** Guided form: it walks the user through formulating an assumption that can actually be checked later. */
export function AssumptionFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { nodes } = useInventory();
  const { createAssumption } = useStrategy();
  const [statement, setStatement] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [trigger, setTrigger] = useState('');
  const [evidence, setEvidence] = useState('');
  const [days, setDays] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const options = nodes.filter((n) => isFieldArtifact(n) && (!q || n.title.toLowerCase().includes(q))).slice(0, 10);

  const save = async () => {
    setBusy(true); setError(null);
    try { onDone(await createAssumption({ statement: statement.trim(), evidence: evidence.trim() || null, trigger_text: trigger.trim() || null, review_every_days: days, nodeIds: picked })); }
    catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Page>
      <BackButton onBack={onCancel} />
      <Header title={t('assumption.formTitle')} hint={t('assumption.formHint')} size="h2" />

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('assumption.step1')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {(['we_use', 'we_dont_use', 'we_believe'] as const).map((k) => <Chip key={k} label={t(`assumption.starter.${k}`)} onPress={() => setStatement(statement ? statement : t(`assumption.starter.${k}_text`))} />)}
        </View>
        <Field label={t('assumption.statement')} value={statement} onChangeText={setStatement} multiline maxLength={1000} placeholder={t('assumption.statementPlaceholder')} />
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('assumption.step2')}</Text>
        <Field label={t('inventory.search')} value={query} onChangeText={setQuery} placeholder={t('inventory.searchPlaceholder')} />
        <ChipRow kind="checkbox">
          {options.map((n) => <Chip key={n.id} label={n.title} selected={picked.includes(n.id)} onPress={() => setPicked((p) => (p.includes(n.id) ? p.filter((x) => x !== n.id) : [...p, n.id]))} />)}
        </ChipRow>
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('assumption.step3')}</Text>
        <Field label={t('assumption.trigger')} value={trigger} onChangeText={setTrigger} multiline maxLength={1000} placeholder={t('assumption.triggerPlaceholder')} />
        <Text variant="secondary">{t('assumption.triggerHint')}</Text>
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('assumption.step4')}</Text>
        <Field label={t('assumption.evidence')} value={evidence} onChangeText={setEvidence} multiline maxLength={2000} />
        <Text variant="overline">{t('assumption.reviewEvery')}</Text>
        <ChipRow kind="radio">
          {INTERVALS.map((d) => <Chip key={d} label={t('assumption.days', { count: d })} selected={days === d} onPress={() => setDays(d)} />)}
        </ChipRow>
      </View>

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('assumption.create')} onPress={save} loading={busy} disabled={!statement.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}

export function AssumptionDetailScreen({ id, onBack, onOpenNode }: { id: string; onBack: () => void; onOpenNode: (id: string) => void }) {
  const { t, i18n } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { assumptions, assumptionNodes, assumptionReviews, reviewAssumption, updateAssumption, deleteAssumption } = useStrategy();
  const a = assumptions.find((x) => x.id === id);
  const [note, setNote] = useState('');
  const [risk, setRisk] = useState(false);
  const [evidence, setEvidence] = useState<string | null>(null);
  const { busy, error, run } = useAction();

  if (!a || !current) return <NotFound message={t('assumption.notFound')} onBack={onBack} />;

  const manager = canManageAll(current.role);
  const linked = assumptionNodes.filter((x) => x.assumption_id === id).map((x) => byId[x.node_id]).filter(Boolean);
  const history = assumptionReviews.filter((r) => r.assumption_id === id);
  const review = (s: AssumptionStatus) => run(s, async () => { await reviewAssumption(id, s, note.trim() || null, risk); setNote(''); setRisk(false); });

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t(`assumptionStatus.${a.status}`)}{a.accepted_risk ? ` · ${t('strategy.riskAccepted')}` : ''} · {isDue(a) ? t('strategy.reviewDue') : `${t('strategy.nextReview')} ${a.next_review}`}</Text>
        <Text variant="h2">{a.statement}</Text>
      </View>
      {error && <Text variant="error">{error}</Text>}

      {linked.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('assumption.concerns')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>{linked.map((n) => <Chip key={n.id} label={n.title} onPress={() => onOpenNode(n.id)} />)}</View>
        </View>
      )}
      {a.trigger_text && <Card><Text variant="overline">{t('assumption.trigger')}</Text><Text>{a.trigger_text}</Text></Card>}

      <Card>
        <Text variant="overline">{t('assumption.evidence')}</Text>
        {manager ? (
          <View style={{ gap: space[3] }}>
            <Field label={t('assumption.evidence')} value={evidence ?? a.evidence ?? ''} onChangeText={setEvidence} multiline maxLength={2000} />
            {evidence !== null && evidence !== (a.evidence ?? '') && <Button variant="secondary" label={t('form.save')} loading={busy === 'ev'} style={{ alignSelf: 'flex-start' }} onPress={() => run('ev', async () => { await updateAssumption(id, { evidence: evidence.trim() || null }); setEvidence(null); })} />}
          </View>
        ) : <Text>{a.evidence ?? '—'}</Text>}
      </Card>

      {!manager && <ViewOnly />}
      {manager && (
        <Card>
          <Text variant="h3">{t('assumption.reviewTitle')}</Text>
          <Text variant="secondary">{t('assumption.reviewHint')}</Text>
          <Field label={t('assumption.reviewNote')} value={note} onChangeText={setNote} multiline maxLength={2000} />
          <CheckRow label={t('assumption.acceptRisk')} checked={risk} onPress={() => setRisk(!risk)} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[3] }}>
            {ASSUMPTION_STATUSES.map((s) => <Button key={s} variant={s === 'valid' ? 'primary' : 'secondary'} label={t(`assumption.mark.${s}`)} loading={busy === s} onPress={() => review(s)} />)}
          </View>
        </Card>
      )}

      {history.length > 0 && (
        <View style={{ gap: space[3] }}>
          <Text variant="overline">{t('assumption.history')}</Text>
          {history.map((r) => <Text key={r.id} variant="secondary">{new Date(r.reviewed_at).toLocaleDateString(i18n.language)} · {t(`assumptionStatus.${r.status}`)}{r.note ? ` · ${r.note}` : ''}</Text>)}
        </View>
      )}

      {manager && <ConfirmButton label={t('assumption.delete')} message={t('assumption.deleteConfirm')} onConfirm={() => run('del', async () => { await deleteAssumption(id); onBack(); })} style={{ alignSelf: 'flex-start' }} />}
    </Page>
  );
}
