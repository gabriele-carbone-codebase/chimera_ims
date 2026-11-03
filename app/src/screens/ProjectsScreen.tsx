import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { useProjects } from '../state/Projects';
import { STAGES, type ProjectStage } from '../lib/projects';
import { Button, Card, Chip, Page, Text } from '../components/ui';
import { StageTrack } from '../components/StageTrack';
import { space } from '../theme/tokens';

export function ProjectsScreen({ onOpen, onNew }: { onOpen: (id: string) => void; onNew: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { projects, gateCriteria, items, loading } = useProjects();
  const [filter, setFilter] = useState<ProjectStage | 'all'>('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    projects.forEach((p) => { c[p.stage] = (c[p.stage] ?? 0) + 1; });
    return c;
  }, [projects]);

  const rows = projects
    .filter((p) => filter === 'all' || p.stage === filter)
    .map((p) => ({ p, node: byId[p.node_id] }))
    .filter((r) => r.node)
    .sort((a, b) => b.node.created_at.localeCompare(a.node.created_at));

  const canCreate = current && ['owner', 'innovation_manager', 'contributor'].includes(current.role);

  return (
    <Page>
      <View style={{ gap: space[2] }}>
        <Text variant="h1">{t('projects.title')}</Text>
        <Text variant="secondary">{t('projects.hint')}</Text>
      </View>

      {canCreate && <Button label={t('projects.new')} onPress={onNew} style={{ alignSelf: 'flex-start' }} />}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        <Chip label={`${t('ideas.all')} · ${counts.all}`} selected={filter === 'all'} onPress={() => setFilter('all')} />
        {STAGES.map((s) => <Chip key={s} label={`${t(`stage.${s}`)} · ${counts[s] ?? 0}`} selected={filter === s} onPress={() => setFilter(s)} />)}
      </View>

      {loading ? <Text variant="secondary">{t('common.loading')}</Text> : rows.length === 0 ? (
        <Card>
          <Text variant="h3">{t('projects.empty')}</Text>
          <Text variant="secondary">{t('projects.emptyHint')}</Text>
        </Card>
      ) : (
        <View style={{ gap: space[4] }}>
          {rows.map(({ p, node }) => {
            const need = gateCriteria.filter((c) => p.stage !== 'shipped' && c.from_stage === p.stage);
            const met = need.filter((c) => items.some((i) => i.project_id === p.node_id && i.criterion_id === c.id)).length;
            return (
              <Card key={p.node_id} onPress={() => onOpen(p.node_id)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4] }}>
                  <Text variant="h3" style={{ flex: 1 }}>{node.title}</Text>
                  {p.status !== 'active' && <Text variant="overline">{t(`projectStatus.${p.status}`)}</Text>}
                </View>
                <StageTrack stage={p.stage} muted={p.status !== 'active'} />
                <Text variant="overline">
                  {p.stage === 'shipped' ? t('projects.shipped') : t('projects.criteriaMet', { met, total: need.length })}
                  {p.source_idea_id ? ` · ${t('projects.fromIdea')}` : ''}
                </Text>
              </Card>
            );
          })}
        </View>
      )}
    </Page>
  );
}
