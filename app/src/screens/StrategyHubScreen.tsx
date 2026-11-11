import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useStrategy } from '../state/Strategy';
import { canManageAll } from '../lib/inventory';
import { isDue, isFieldArtifact } from '../lib/strategy';
import { Button, Card, Chip, ChipRow, Field, Header, Page, Text, ViewOnly } from '../components/ui';
import { ProgressBar } from '../components/charts';
import { space } from '../theme/tokens';

type Tab = 'field' | 'assumptions' | 'strategies';

export function StrategyHubScreen({ onOpenAssumption, onNewAssumption, onOpenStrategy, onOpenNode }: {
  onOpenAssumption: (id: string) => void; onNewAssumption: () => void; onOpenStrategy: (id: string) => void; onOpenNode: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const { current } = useApp();
  const { nodes } = useInventory();
  const { field, monitoring, assumptions, strategies, transitions, active, draft, activeDrift, loading, saveField, setMonitored, createDraft } = useStrategy();
  const [tab, setTab] = useState<Tab>('field');
  const [estimate, setEstimate] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manager = current ? canManageAll(current.role) : false;

  const artifacts = nodes.filter(isFieldArtifact);
  const monitored = new Set(monitoring.map((m) => m.node_id));
  const known = artifacts.length;
  const est = estimate ?? (field.estimated_total != null ? String(field.estimated_total) : '');
  const estNum = Number(est);
  const coverage = field.estimated_total && field.estimated_total > 0 ? Math.min(1, known / field.estimated_total) : null;
  const due = assumptions.filter((a) => isDue(a));
  const run = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); } catch (e: any) { setError(e?.message ?? t('common.error')); } finally { setBusy(false); } };

  return (
    <Page>
      <Header title={t('strategy.title')} hint={t('strategy.hint')} />
      {error && <Text variant="error">{error}</Text>}

      {activeDrift.suggest && active && (
        <Card selected onPress={() => onOpenStrategy(active.id)}>
          <Text variant="h3">{t('strategy.driftTitle')}</Text>
          <Text variant="secondary">{t('strategy.driftBody', { changed: activeDrift.changed, total: activeDrift.total })}</Text>
        </Card>
      )}
      {due.length > 0 && (
        <Card onPress={() => setTab('assumptions')}>
          <Text variant="h3">{t('strategy.dueTitle', { count: due.length })}</Text>
          <Text variant="secondary">{t('strategy.dueBody')}</Text>
        </Card>
      )}

      <ChipRow kind="tab">
        <Chip label={t('strategy.tabField')} accessibilityLabel={t('strategy.tabField')} selected={tab === 'field'} onPress={() => setTab('field')} />
        <Chip label={`${t('strategy.tabAssumptions')} · ${assumptions.length}`} accessibilityLabel={`${t('strategy.tabAssumptions')} (${assumptions.length})`} selected={tab === 'assumptions'} onPress={() => setTab('assumptions')} />
        <Chip label={`${t('strategy.tabStrategies')} · ${strategies.length}`} accessibilityLabel={`${t('strategy.tabStrategies')} (${strategies.length})`} selected={tab === 'strategies'} onPress={() => setTab('strategies')} />
      </ChipRow>

      {loading && <Text variant="secondary">{t('common.loading')}</Text>}

      {tab === 'field' && (
        <View style={{ gap: space[5] }}>
          <Text variant="secondary">{t('strategy.fieldHint')}</Text>
          <Card>
            <Text variant="overline">{t('strategy.fieldCoverage')}</Text>
            <Text variant="h2">{t('strategy.fieldKnown', { known, monitored: artifacts.filter((n) => monitored.has(n.id)).length })}</Text>
            {coverage != null && <><ProgressBar value={coverage} /><Text variant="secondary">{t('strategy.fieldCoverageValue', { pct: Math.round(coverage * 100), total: field.estimated_total })}</Text></>}
            {manager && (
              <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end', marginTop: space[3] }}>
                <View style={{ flex: 1 }}><Field label={t('strategy.fieldEstimate')} value={est} onChangeText={setEstimate} inputMode="decimal" /></View>
                <Button variant="secondary" label={t('form.save')} loading={busy} disabled={est.trim() === '' || !Number.isFinite(estNum) || estNum < 0}
                  onPress={() => run(async () => { await saveField(Math.round(estNum), field.notes); setEstimate(null); })} />
              </View>
            )}
          </Card>
          {artifacts.length === 0 && <Text variant="secondary">{t('strategy.fieldEmpty')}</Text>}
          <View style={{ gap: space[3] }}>
            {artifacts.slice(0, 60).map((n) => (
              <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
                <Text style={{ flex: 1 }} onPress={() => onOpenNode(n.id)}>{n.title} <Text variant="overline">{t(`type.${n.type}`)}</Text></Text>
                <Chip label={monitored.has(n.id) ? t('strategy.monitored') : t('strategy.known')} accessibilityRole={manager ? 'checkbox' : undefined} selected={monitored.has(n.id)}
                  onPress={manager ? () => run(() => setMonitored(n.id, !monitored.has(n.id))) : undefined} />
              </View>
            ))}
          </View>
        </View>
      )}

      {tab === 'assumptions' && (
        <View style={{ gap: space[4] }}>
          <Text variant="secondary">{t('strategy.assumptionsHint')}</Text>
          {manager ? <Button label={t('strategy.newAssumption')} onPress={onNewAssumption} style={{ alignSelf: 'flex-start' }} /> : <ViewOnly />}
          {assumptions.length === 0 && <Card><Text variant="h3">{t('strategy.noAssumptions')}</Text><Text variant="secondary">{t('strategy.noAssumptionsHint')}</Text></Card>}
          {[...assumptions].sort((a, b) => a.next_review.localeCompare(b.next_review)).map((a) => (
            <Card key={a.id} onPress={() => onOpenAssumption(a.id)}>
              <Text variant="h3">{a.statement}</Text>
              <Text variant="overline">
                {t(`assumptionStatus.${a.status}`)}{a.accepted_risk ? ` · ${t('strategy.riskAccepted')}` : ''} · {isDue(a) ? t('strategy.reviewDue') : `${t('strategy.nextReview')} ${a.next_review}`}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {tab === 'strategies' && (
        <View style={{ gap: space[4] }}>
          <Text variant="secondary">{t('strategy.strategiesHint')}</Text>
          {!manager && <ViewOnly />}
          {manager && !draft && (
            <Button label={active ? t('strategy.newVersion') : t('strategy.firstStrategy')} loading={busy} style={{ alignSelf: 'flex-start' }}
              onPress={() => run(async () => { onOpenStrategy(await createDraft(active ? t('strategy.versionTitle', { n: (strategies[0]?.version ?? 0) + 1 }) : t('strategy.firstTitle'))); })} />
          )}
          {strategies.length === 0 && <Card><Text variant="h3">{t('strategy.noStrategies')}</Text><Text variant="secondary">{t('strategy.noStrategiesHint')}</Text></Card>}
          {strategies.map((s) => (
            <Card key={s.id} selected={s.status === 'active'} onPress={() => onOpenStrategy(s.id)}>
              <Text variant="overline">v{s.version} · {t(`strategyStatus.${s.status}`)}{s.status === 'active' ? ` · ${t('strategy.asIs')}` : s.status === 'draft' ? ` · ${t('strategy.toBe')}` : ''}</Text>
              <Text variant="h3">{s.title}</Text>
            </Card>
          ))}
          {transitions.length > 0 && (
            <View style={{ gap: space[3] }}>
              <Text variant="overline">{t('strategy.transitions')}</Text>
              {transitions.slice(0, 5).map((tr) => {
                const from = strategies.find((s) => s.id === tr.from_strategy); const to = strategies.find((s) => s.id === tr.to_strategy);
                return <Text key={tr.id} variant="secondary">{new Date(tr.created_at).toLocaleDateString(i18n.language)} · {from ? `v${from.version} → ` : ''}v{to?.version ?? '?'}{tr.reason ? ` · ${tr.reason}` : ''}</Text>;
              })}
            </View>
          )}
        </View>
      )}
    </Page>
  );
}
