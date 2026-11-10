import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useProjects } from '../state/Projects';
import { canManageAll, canWrite } from '../lib/inventory';
import { nextStage, type GateChoice, type GateCriterion } from '../lib/projects';
import { BackButton, Button, Card, Chip, Field, NotFound, Page, Text, useAction } from '../components/ui';
import { StageTrack } from '../components/StageTrack';
import { space } from '../theme/tokens';

export function ProjectDetailScreen({ id, onBack, onOpenNode, onOpenIdea }: {
  id: string; onBack: () => void; onOpenNode: (id: string) => void; onOpenIdea: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { projects, gateCriteria, items, reviews, reviewers, toggleItem, addGateCriterion, review, resume } = useProjects();
  const node = byId[id];
  const project = projects.find((p) => p.node_id === id);
  const role = current?.role;
  const simple = current?.expertise_level === 'business_owner';
  const [note, setNote] = useState('');
  const [shipAs, setShipAs] = useState<'product' | 'service'>('product');
  const [newCriterion, setNewCriterion] = useState('');
  const { busy, error, run } = useAction();

  if (!node || !project || !role) return <NotFound message={t('projects.notFound')} onBack={onBack} />;

  const manager = canManageAll(role);
  const closed = project.stage === 'shipped';
  const criteria = closed ? [] : gateCriteria.filter((c) => c.from_stage === project.stage);
  const isMet = (c: GateCriterion) => items.some((i) => i.project_id === id && i.criterion_id === c.id);
  const unmet = criteria.filter((c) => !isMet(c)).length;
  const label = (c: GateCriterion) => (c.key ? t(`gateCriteria.${c.key}`) : c.name ?? '');
  const history = reviews.filter((r) => r.project_id === id);
  const next = nextStage(project.stage);
  const product = project.product_id ? byId[project.product_id] : undefined;

  const decide = (choice: GateChoice) => run(choice, async () => { await review(id, choice, note.trim() || null, shipAs); setNote(''); });

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t(`stage.${project.stage}`)}{project.status !== 'active' ? ` · ${t(`projectStatus.${project.status}`)}` : ''}</Text>
        <Text variant="h1">{node.title}</Text>
        {node.description && <Text variant="secondary">{node.description}</Text>}
        <StageTrack stage={project.stage} muted={project.status !== 'active'} />
      </View>
      {error && <Text variant="error">{error}</Text>}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        {project.source_idea_id && byId[project.source_idea_id] && <Button variant="secondary" label={`${t('projects.sourceIdea')}: ${byId[project.source_idea_id].title}`} onPress={() => onOpenIdea(project.source_idea_id!)} />}
        {product && <Button variant="secondary" label={`${t(`subtype.${product.subtype ?? 'product'}`)}: ${product.title}`} onPress={() => onOpenNode(product.id)} />}
        <Button variant="ghost" label={t('projects.openInInventory')} onPress={() => onOpenNode(id)} />
      </View>

      {closed ? (
        <Card selected>
          <Text variant="h3">{t('projects.shippedTitle')}</Text>
          <Text variant="secondary">{t('projects.shippedHint')}</Text>
        </Card>
      ) : (
        <Card>
          <Text variant="h3">{t('projects.gateTitle', { stage: t(`stage.${project.stage}`), next: next ? t(`stage.${next}`) : '' })}</Text>
          <Text variant="secondary">{t('projects.gateHint')}</Text>
          <View style={{ gap: space[3], marginTop: space[4] }}>
            {criteria.map((c) => {
              const met = isMet(c);
              return (
                <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
                  <Chip label={met ? t('projects.met') : t('projects.notMet')} selected={met}
                    onPress={canWrite(role) ? () => run(c.id, () => toggleItem(id, c.id, !met)) : undefined} />
                  <Text style={{ flex: 1 }}>{label(c)}</Text>
                </View>
              );
            })}
            {manager && !simple && (
              <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end', marginTop: space[3] }}>
                <View style={{ flex: 1 }}><Field label={t('projects.newCriterion')} value={newCriterion} onChangeText={setNewCriterion} maxLength={200} /></View>
                <Button variant="secondary" label={t('ideas.addCriterion')} disabled={!newCriterion.trim()} loading={busy === 'crit'}
                  onPress={() => run('crit', async () => { await addGateCriterion(project.stage as 'define' | 'build' | 'test', newCriterion.trim()); setNewCriterion(''); })} />
              </View>
            )}
          </View>
        </Card>
      )}

      {manager && !closed && (
        <Card>
          <Text variant="h3">{t('projects.reviewTitle')}</Text>
          {project.status === 'stopped' || project.status === 'on_hold' ? (
            <View style={{ gap: space[4], marginTop: space[3] }}>
              <Text variant="secondary">{t(`projects.is_${project.status}`)}</Text>
              <Button label={t('projects.resume')} loading={busy === 'resume'} onPress={() => run('resume', () => resume(id))} style={{ alignSelf: 'flex-start' }} />
            </View>
          ) : (
            <View style={{ gap: space[4], marginTop: space[3] }}>
              {project.stage === 'test' && (
                <View style={{ gap: space[3] }}>
                  <Text variant="overline">{t('projects.shipAs')}</Text>
                  <View style={{ flexDirection: 'row', gap: space[3] }}>
                    <Chip label={t('subtype.product')} selected={shipAs === 'product'} onPress={() => setShipAs('product')} />
                    <Chip label={t('subtype.service')} selected={shipAs === 'service'} onPress={() => setShipAs('service')} />
                  </View>
                </View>
              )}
              <Field label={t('projects.reviewNote')} value={note} onChangeText={setNote} multiline maxLength={2000} />
              {unmet > 0 && <Text variant="secondary">{t('projects.unmet', { count: unmet })}</Text>}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
                <Button label={project.stage === 'test' ? t('projects.ship') : t('projects.go')} loading={busy === 'go'} disabled={unmet > 0} onPress={() => decide('go')} />
                <Button variant="secondary" label={t('projects.hold')} loading={busy === 'hold'} onPress={() => decide('hold')} />
                <Button variant="secondary" label={t('projects.stop')} loading={busy === 'stop'} onPress={() => decide('stop')} />
              </View>
            </View>
          )}
        </Card>
      )}

      {history.length > 0 && (
        <View style={{ gap: space[4] }}>
          <Text variant="overline">{t('projects.history')}</Text>
          {history.map((r) => (
            <Card key={r.id}>
              <Text variant="overline">
                {new Date(r.decided_at).toLocaleDateString()} · {t(`stage.${r.from_stage}`)}{r.to_stage ? ` → ${t(`stage.${r.to_stage}`)}` : ''} · {t(`decision.${r.decision}`)}
              </Text>
              {r.decided_by && reviewers[r.decided_by] ? <Text variant="secondary">{reviewers[r.decided_by]}</Text> : null}
              {r.note && <Text>{r.note}</Text>}
            </Card>
          ))}
        </View>
      )}
    </Page>
  );
}
