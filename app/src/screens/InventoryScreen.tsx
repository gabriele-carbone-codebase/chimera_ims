import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { NODE_TYPES, canWrite, type NodeType } from '../lib/inventory';
import { Button, Card, Chip, Field, Header, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function InventoryScreen({ tab, onTab, onOpen, onAdd }: {
  tab: NodeType; onTab: (t: NodeType) => void; onOpen: (id: string) => void; onAdd: (t: NodeType) => void;
}) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { nodes, relationships, loading } = useInventory();
  const [query, setQuery] = useState('');

  const counts = useMemo(() => Object.fromEntries(NODE_TYPES.map((ty) => [ty, nodes.filter((n) => n.type === ty).length])), [nodes]);
  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    relationships.forEach((r) => { if (r.strength !== 'none') { d[r.from_node] = (d[r.from_node] ?? 0) + 1; d[r.to_node] = (d[r.to_node] ?? 0) + 1; } });
    return d;
  }, [relationships]);

  const q = query.trim().toLowerCase();
  const list = nodes.filter((n) => n.type === tab && (!q || n.title.toLowerCase().includes(q) || (n.description ?? '').toLowerCase().includes(q)));
  const writable = current ? canWrite(current.role) : false;

  return (
    <Page>
      <Header title={t('inventory.title')} hint={t('inventory.hint')} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        {NODE_TYPES.map((ty) => <Chip key={ty} label={`${t(`typePlural.${ty}`)} · ${counts[ty]}`} selected={tab === ty} onPress={() => onTab(ty)} />)}
      </View>

      <View style={{ flexDirection: 'row', gap: space[4], alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}><Field label={t('inventory.search')} value={query} onChangeText={setQuery} placeholder={t('inventory.searchPlaceholder')} /></View>
        {writable && <Button label={t('inventory.add', { type: t(`type.${tab}`).toLowerCase() })} onPress={() => onAdd(tab)} />}
      </View>

      {loading ? <Text variant="secondary">{t('common.loading')}</Text> : list.length === 0 ? (
        <Card>
          <Text variant="h3">{q ? t('inventory.noResults') : t('inventory.empty', { type: t(`typePlural.${tab}`).toLowerCase() })}</Text>
          {!q && <Text variant="secondary">{t(`inventory.emptyHint.${tab}`)}</Text>}
        </Card>
      ) : (
        <View style={{ gap: space[4] }}>
          {list.map((n) => (
            <Card key={n.id} onPress={() => onOpen(n.id)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[4] }}>
                <Text variant="h3" style={{ flex: 1 }}>{n.title}</Text>
                {!!degree[n.id] && <Text variant="overline">{t('inventory.links', { count: degree[n.id] })}</Text>}
              </View>
              {n.subtype && <Text variant="overline">{t(`subtype.${n.subtype}`, { defaultValue: n.subtype })}</Text>}
              {n.description && <Text variant="secondary" numberOfLines={2}>{n.description}</Text>}
            </Card>
          ))}
        </View>
      )}
    </Page>
  );
}
