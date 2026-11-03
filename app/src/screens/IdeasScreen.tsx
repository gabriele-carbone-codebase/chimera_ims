import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useIdeas } from '../state/Ideas';
import { IDEA_STATUSES, computeResult, type IdeaStatus } from '../lib/ideas';
import { Button, Card, Chip, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function IdeasScreen({ onOpen, onPropose }: { onOpen: (id: string) => void; onPropose: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { ideas, ideaCriteria, evaluations, authors, loading } = useIdeas();
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ideas.length };
    ideas.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1; });
    return c;
  }, [ideas]);

  const rows = ideas
    .filter((i) => filter === 'all' || i.status === filter)
    .map((i) => ({ idea: i, node: byId[i.node_id] }))
    .filter((r) => r.node)
    .sort((a, b) => b.node.created_at.localeCompare(a.node.created_at));

  const canPropose = current && current.role !== 'viewer';

  return (
    <Page>
      <View style={{ gap: space[2] }}>
        <Text variant="h1">{t('ideas.title')}</Text>
        <Text variant="secondary">{t('ideas.hint')}</Text>
      </View>

      {canPropose && <Button label={t('ideas.propose')} onPress={onPropose} style={{ alignSelf: 'flex-start' }} />}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        <Chip label={`${t('ideas.all')} · ${counts.all}`} selected={filter === 'all'} onPress={() => setFilter('all')} />
        {IDEA_STATUSES.map((s) => <Chip key={s} label={`${t(`status.${s}`)} · ${counts[s] ?? 0}`} selected={filter === s} onPress={() => setFilter(s)} />)}
      </View>

      {loading ? <Text variant="secondary">{t('common.loading')}</Text> : rows.length === 0 ? (
        <Card>
          <Text variant="h3">{t('ideas.empty')}</Text>
          <Text variant="secondary">{t('ideas.emptyHint')}</Text>
        </Card>
      ) : (
        <View style={{ gap: space[4] }}>
          {rows.map(({ idea, node }) => {
            const res = computeResult(ideaCriteria.filter((c) => c.idea_id === idea.node_id), evaluations.filter((e) => e.idea_id === idea.node_id));
            const author = idea.anonymous ? t('ideas.anonymous') : authors[node.created_by ?? ''] || '—';
            return (
              <Card key={idea.node_id} onPress={() => onOpen(idea.node_id)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4] }}>
                  <Text variant="h3" style={{ flex: 1 }}>{node.title}</Text>
                  <Text variant="overline">{t(`status.${idea.status}`)}</Text>
                </View>
                {node.description && <Text variant="secondary" numberOfLines={2}>{node.description}</Text>}
                <Text variant="overline">{author}{res.score != null ? ` · ${t('ideas.score')} ${res.score.toFixed(1)}/5` : ''}</Text>
              </Card>
            );
          })}
        </View>
      )}
    </Page>
  );
}
