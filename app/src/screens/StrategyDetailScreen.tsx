import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useStrategy } from '../state/Strategy';
import { canManageAll } from '../lib/inventory';
import { UNITS, driftOf, isFieldArtifact, usageOf, usedSet, type InvestUnit } from '../lib/strategy';
import { BackButton, Button, Card, Chip, Field, NotFound, Page, Text, useAction } from '../components/ui';
import { space } from '../theme/tokens';

export function StrategyDetailScreen({ id, onBack, onOpenNode, onOpenAssumption }: { id: string; onBack: () => void; onOpenNode: (id: string) => void; onOpenAssumption: (id: string) => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { nodes, relationships } = useInventory();
  const s = useStrategy();
  const strategy = s.strategies.find((x) => x.id === id);
  const [title, setTitle] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [units, setUnits] = useState<Record<string, InvestUnit>>({});
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const { busy, error, run } = useAction();
  const [saved, setSaved] = useState(false);

  const invs = useMemo(() => s.investments.filter((i) => i.strategy_id === id), [s.investments, id]);
  const decisions = useMemo(() => s.decisions.filter((d) => d.strategy_id === id), [s.decisions, id]);
  const links = useMemo(() => s.links.filter((l) => l.strategy_id === id), [s.links, id]);
  const used = useMemo(() => usedSet(relationships, invs), [relationships, invs]);

  if (!strategy || !current) return <NotFound message={t('strategy.notFound')} onBack={onBack} />;

  const isDraft = strategy.status === 'draft';
  const editable = isDraft && canManageAll(current.role);
  const activities = nodes.filter((n) => n.type === 'activity' && n.subtype !== 'program');
  const artifacts = nodes.filter((n) => isFieldArtifact(n) && n.type !== 'activity');
  const invOf = (actId: string) => invs.find((i) => i.activity_id === actId);
  const amountOf = (actId: string) => amounts[actId] ?? String(invOf(actId)?.amount ?? '');
  const unitOf = (actId: string): InvestUnit => units[actId] ?? invOf(actId)?.unit ?? 'hours';
  const drift = driftOf(links, s.assumptions);
  const counts = { used: 0, not_used: 0, undecided: 0 };
  artifacts.forEach((n) => { counts[usageOf(n.id, used, decisions)] += 1; });

  const changedRows = activities.filter((a) => amounts[a.id] !== undefined || units[a.id] !== undefined).map((a) => ({ activity_id: a.id, amount: Math.max(0, Number((amountOf(a.id) || '0').replace(',', '.')) || 0), unit: unitOf(a.id) }));

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">v{strategy.version} · {t(`strategyStatus.${strategy.status}`)}{strategy.status === 'active' ? ` · ${t('strategy.asIs')}` : isDraft ? ` · ${t('strategy.toBe')}` : ''}</Text>
        {editable ? (
          <Field label={t('strategy.fieldName')} value={title ?? strategy.title} onChangeText={setTitle} maxLength={200} />
        ) : <Text variant="h1">{strategy.title}</Text>}
      </View>
      {error && <Text variant="error">{error}</Text>}

      <Card>
        <Text variant="h3">{t('strategy.summaryTitle')}</Text>
        {editable ? (
          <>
            <Field label={t('strategy.summaryTitle')} value={summary ?? strategy.summary ?? ''} onChangeText={setSummary} multiline maxLength={8000} placeholder={t('strategy.summaryPlaceholder')} />
            {(title !== null || summary !== null) && (
              <Button variant="secondary" label={t('form.save')} loading={busy === 'meta'} style={{ alignSelf: 'flex-start', marginTop: space[3] }}
                onPress={() => run('meta', async () => { await s.updateStrategy(id, { title: (title ?? strategy.title).trim() || strategy.title, summary: (summary ?? strategy.summary ?? '').trim() || null }); setTitle(null); setSummary(null); })} />
            )}
          </>
        ) : <Text variant="secondary">{strategy.summary ?? t('strategy.noSummary')}</Text>}
      </Card>

      {strategy.status === 'active' && links.length > 0 && (
        <Card selected={drift.suggest}>
          <Text variant="h3">{drift.suggest ? t('strategy.driftTitle') : t('strategy.driftOk')}</Text>
          <Text variant="secondary">{t('strategy.driftBody', { changed: drift.changed, total: drift.total })}</Text>
        </Card>
      )}

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('strategy.investments')}</Text>
        <Text variant="secondary">{t('strategy.investmentsHint')}</Text>
        {activities.length === 0 && <Text variant="secondary">{t('strategy.noActivities')}</Text>}
        {activities.map((a) => (
          <Card key={a.id}>
            <Text variant="h3" onPress={() => onOpenNode(a.id)}>{a.title}</Text>
            {editable ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'flex-end' }}>
                <View style={{ width: 120 }}><Field label={t('strategy.amount')} value={amountOf(a.id)} onChangeText={(v) => { setSaved(false); setAmounts((m) => ({ ...m, [a.id]: v })); }} keyboardType="numeric" /></View>
                {UNITS.map((u) => <Chip key={u} label={t(`unit.${u}`)} selected={unitOf(a.id) === u} onPress={() => { setSaved(false); setUnits((m) => ({ ...m, [a.id]: u })); }} />)}
              </View>
            ) : <Text variant="secondary">{invOf(a.id) && invOf(a.id)!.amount > 0 ? `${invOf(a.id)!.amount} ${t(`unit.${invOf(a.id)!.unit}`)}` : t('strategy.notInvested')}</Text>}
          </Card>
        ))}
        {editable && activities.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
            <Button variant="secondary" label={t('strategy.saveInvestments')} loading={busy === 'inv'} disabled={changedRows.length === 0}
              onPress={() => run('inv', async () => { await s.saveInvestments(id, changedRows); setAmounts({}); setUnits({}); setSaved(true); })} />
            {saved && <Text variant="secondary">{t('ideas.saved')}</Text>}
          </View>
        )}
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('strategy.system')}</Text>
        <Text variant="secondary">{t('strategy.systemSummary', counts)}</Text>
        {artifacts.length === 0 && <Text variant="secondary">{t('strategy.fieldEmpty')}</Text>}
        {artifacts.map((n) => {
          const u = usageOf(n.id, used, decisions);
          const dec = decisions.find((d) => d.node_id === n.id);
          return (
            <Card key={n.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4] }}>
                <Text style={{ flex: 1 }} onPress={() => onOpenNode(n.id)}>{n.title}</Text>
                <Text variant="overline">{t(`usage.${u}`)}</Text>
              </View>
              {editable && u !== 'used' && (
                <View style={{ gap: space[3], marginTop: space[3] }}>
                  {u === 'undecided' ? (
                    <Chip label={t('strategy.markNotUsed')} onPress={() => run(`d${n.id}`, () => s.setDecision(id, n.id, null))} />
                  ) : (
                    <>
                      <Text variant="overline">{t('strategy.because')}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
                        {s.assumptions.map((a) => <Chip key={a.id} label={a.statement.length > 40 ? `${a.statement.slice(0, 40)}…` : a.statement} selected={dec?.assumption_id === a.id} onPress={() => run(`d${n.id}`, () => s.setDecision(id, n.id, dec?.assumption_id === a.id ? null : a.id))} />)}
                        {s.assumptions.length === 0 && <Text variant="secondary">{t('strategy.noAssumptionsYet')}</Text>}
                      </View>
                      <Chip label={t('strategy.undo')} tone="danger" onPress={() => run(`d${n.id}`, () => s.clearDecision(id, n.id))} />
                    </>
                  )}
                </View>
              )}
              {!editable && dec?.assumption_id && <Text variant="secondary" onPress={() => onOpenAssumption(dec.assumption_id!)}>{s.assumptions.find((a) => a.id === dec.assumption_id)?.statement}</Text>}
            </Card>
          );
        })}
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('strategy.restsOn')}</Text>
        {links.length === 0 && <Text variant="secondary">{t('strategy.noLinks')}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {s.assumptions.map((a) => {
            const l = links.find((x) => x.assumption_id === a.id);
            if (!editable && !l) return null;
            return <Chip key={a.id} label={a.statement.length > 48 ? `${a.statement.slice(0, 48)}…` : a.statement} selected={!!l}
              onPress={editable ? () => run(`l${a.id}`, () => (l ? s.unlinkAssumption(id, a.id) : s.linkAssumption(id, a.id, a.status))) : () => onOpenAssumption(a.id)} />;
          })}
        </View>
      </View>

      {editable && (
        <Card>
          <Text variant="h3">{t('strategy.activateTitle')}</Text>
          <Text variant="secondary">{t('strategy.activateHint')}</Text>
          <Field label={t('strategy.reason')} value={reason} onChangeText={setReason} maxLength={2000} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[3] }}>
            <Button label={t('strategy.activate')} loading={busy === 'act'} onPress={() => run('act', () => s.activate(id, reason.trim() || null))} />
            <Button variant="ghost" label={confirming ? t('goals.confirmDelete') : t('strategy.deleteDraft')} onPress={() => (confirming ? run('del', async () => { await s.deleteStrategy(id); onBack(); }) : setConfirming(true))} />
          </View>
        </Card>
      )}
    </Page>
  );
}
