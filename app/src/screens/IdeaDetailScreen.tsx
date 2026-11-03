import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useIdeas } from '../state/Ideas';
import { useProjects } from '../state/Projects';
import { canManageAll } from '../lib/inventory';
import { DEFAULT_WEIGHT, SCORES, WEIGHTS, computeResult, type Criterion, type IdeaStatus } from '../lib/ideas';
import { Button, Card, Chip, Field, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function IdeaDetailScreen({ id, onBack, onOpenProject }: { id: string; onBack: () => void; onOpenProject: (id: string) => void }) {
  const { t } = useTranslation();
  const { current, session } = useApp();
  const { byId } = useInventory();
  const { projects, createProject } = useProjects();
  const { ideas, criteria, ideaCriteria, evaluations, authors, addCriterion, startEvaluation, saveEvaluation, decide } = useIdeas();
  const node = byId[id];
  const idea = ideas.find((i) => i.node_id === id);
  const role = current?.role;
  const userId = session?.user.id;
  const simple = current?.expertise_level === 'business_owner';

  const mine = ideaCriteria.filter((c) => c.idea_id === id);
  const [picks, setPicks] = useState<Record<string, number>>(() =>
    mine.length ? Object.fromEntries(mine.map((c) => [c.criterion_id, c.weight]))
      : Object.fromEntries(criteria.filter((c) => c.is_default).map((c) => [c.id, DEFAULT_WEIGHT])));
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(evaluations.filter((e) => e.idea_id === id && e.evaluator_id === userId).map((e) => [e.criterion_id, e.score])));
  const [newCriterion, setNewCriterion] = useState('');
  const [note, setNote] = useState(idea?.decision_note ?? '');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!node || !idea || !role) return <Page><Text variant="secondary">{t('ideas.notFound')}</Text><Button variant="secondary" label={t('common.back')} onPress={onBack} /></Page>;

  const manager = canManageAll(role);
  const evaluator = manager || role === 'evaluator';
  const label = (c: Criterion) => (c.key ? t(`criteria.${c.key}`) : c.name ?? '');
  const critById = Object.fromEntries(criteria.map((c) => [c.id, c]));
  const result = computeResult(mine, evaluations.filter((e) => e.idea_id === id));
  const author = idea.anonymous ? t('ideas.anonymous') : authors[node.created_by ?? ''] || '—';

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key); setError(null);
    try { await fn(); } catch (e: any) { setError(e?.message ?? t('common.error')); } finally { setBusy(null); }
  };

  const chosen = Object.entries(picks).filter(([, w]) => w > 0);
  const toggle = (cid: string) => setPicks((p) => ({ ...p, [cid]: p[cid] ? 0 : DEFAULT_WEIGHT }));
  const setWeight = (cid: string, w: number) => setPicks((p) => ({ ...p, [cid]: w }));

  return (
    <Page>
      <Button variant="ghost" label={`← ${t('common.back')}`} onPress={onBack} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t(`status.${idea.status}`)} · {author}</Text>
        <Text variant="h1">{node.title}</Text>
        {node.description && <Text variant="secondary">{node.description}</Text>}
      </View>
      {error && <Text variant="error">{error}</Text>}

      {manager && (
        <Card>
          <Text variant="h3">{t('ideas.criteriaTitle')}</Text>
          <Text variant="secondary">{simple ? t('ideas.criteriaHintSimple') : t('ideas.criteriaHint')}</Text>
          <View style={{ gap: space[4], marginTop: space[4] }}>
            {criteria.map((c) => {
              const w = picks[c.id] ?? 0;
              return (
                <View key={c.id} style={{ gap: space[3] }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'center' }}>
                    <Chip label={label(c)} selected={w > 0} onPress={() => toggle(c.id)} />
                    {!simple && w > 0 && (
                      <View style={{ flexDirection: 'row', gap: space[2], alignItems: 'center' }}>
                        <Text variant="overline">{t('ideas.weight')}</Text>
                        {WEIGHTS.map((n) => <Chip key={n} label={String(n)} selected={w === n} onPress={() => setWeight(c.id, n)} />)}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
            {!simple && (
              <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end' }}>
                <View style={{ flex: 1 }}><Field label={t('ideas.newCriterion')} value={newCriterion} onChangeText={setNewCriterion} maxLength={120} /></View>
                <Button variant="secondary" label={t('ideas.addCriterion')} disabled={!newCriterion.trim()} loading={busy === 'crit'}
                  onPress={() => run('crit', async () => { const cid = await addCriterion(newCriterion.trim()); setPicks((p) => ({ ...p, [cid]: DEFAULT_WEIGHT })); setNewCriterion(''); })} />
              </View>
            )}
          </View>
          <Button
            label={idea.status === 'in_evaluation' ? t('ideas.updateCriteria') : t('ideas.startEvaluation')}
            loading={busy === 'start'} disabled={chosen.length === 0} style={{ alignSelf: 'flex-start', marginTop: space[5] }}
            onPress={() => run('start', () => startEvaluation(id, chosen.map(([criterionId, weight]) => ({ criterionId, weight }))))} />
        </Card>
      )}

      {evaluator && idea.status === 'in_evaluation' && (
        <Card>
          <Text variant="h3">{t('ideas.yourEvaluation')}</Text>
          <Text variant="secondary">{t('ideas.scoreHint')}</Text>
          <View style={{ gap: space[4], marginTop: space[4] }}>
            {mine.map((ic) => {
              const c = critById[ic.criterion_id];
              if (!c) return null;
              return (
                <View key={ic.criterion_id} style={{ gap: space[3] }}>
                  <Text>{label(c)}</Text>
                  <View style={{ flexDirection: 'row', gap: space[3] }}>
                    {SCORES.map((n) => <Chip key={n} label={String(n)} selected={scores[ic.criterion_id] === n} onPress={() => { setSaved(false); setScores((s) => ({ ...s, [ic.criterion_id]: n })); }} />)}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4], marginTop: space[5] }}>
            <Button label={t('ideas.saveEvaluation')} loading={busy === 'eval'} disabled={Object.keys(scores).length === 0}
              onPress={() => run('eval', async () => { await saveEvaluation(id, scores); setSaved(true); })} />
            {saved && <Text variant="secondary">{t('ideas.saved')}</Text>}
          </View>
        </Card>
      )}

      {manager && mine.length > 0 && (
        <Card>
          <Text variant="h3">{t('ideas.results')}</Text>
          {result.score == null ? <Text variant="secondary">{t('ideas.noScores')}</Text> : (
            <View style={{ gap: space[3] }}>
              <Text variant="h2">{result.score.toFixed(1)} / 5</Text>
              <Text variant="secondary">{t('ideas.evaluators', { count: result.evaluators })}</Text>
              {mine.map((ic) => (
                <View key={ic.criterion_id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text>{critById[ic.criterion_id] ? label(critById[ic.criterion_id]) : ''}{!simple ? ` (×${ic.weight})` : ''}</Text>
                  <Text variant="secondary">{result.perCriterion[ic.criterion_id] != null ? result.perCriterion[ic.criterion_id].toFixed(1) : '—'}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {manager && (
        <Card>
          <Text variant="h3">{t('ideas.decisionTitle')}</Text>
          <Field label={t('ideas.decisionNote')} value={note} onChangeText={setNote} multiline maxLength={2000} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[4] }}>
            {(['approved', 'on_hold', 'rejected'] as IdeaStatus[]).map((s) => (
              <Button key={s} variant={s === 'approved' ? 'primary' : 'secondary'} label={t(`ideas.decide.${s}`)} loading={busy === s} disabled={idea.status === s}
                onPress={() => run(s, () => decide(id, s, note.trim() || null))} />
            ))}
          </View>
        </Card>
      )}

      {idea.status === 'approved' && (() => {
        const project = projects.find((p) => p.source_idea_id === id);
        const canBuild = role !== 'viewer' && role !== 'evaluator';
        return (
          <Card selected>
            <Text variant="h3">{project ? t('ideas.hasProject') : t('ideas.buildTitle')}</Text>
            {!project && <Text variant="secondary">{t('ideas.buildHint')}</Text>}
            {project ? (
              <Button label={t('ideas.openProject')} onPress={() => onOpenProject(project.node_id)} style={{ alignSelf: 'flex-start', marginTop: space[3] }} />
            ) : canBuild && (
              <Button label={t('ideas.turnIntoProject')} loading={busy === 'project'} style={{ alignSelf: 'flex-start', marginTop: space[3] }}
                onPress={() => run('project', async () => { onOpenProject(await createProject(node.title, node.description, id)); })} />
            )}
          </Card>
        );
      })()}

      {!manager && idea.decision_note && (idea.status === 'approved' || idea.status === 'rejected' || idea.status === 'on_hold') && (
        <Card><Text variant="overline">{t('ideas.decisionTitle')}</Text><Text>{idea.decision_note}</Text></Card>
      )}
    </Page>
  );
}
