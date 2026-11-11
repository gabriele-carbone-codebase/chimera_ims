import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../state/Inventory';
import { NODE_TYPES, type NodeType } from '../lib/inventory';
import { Button, Chip, Field, Text } from './ui';
import { space } from '../theme/tokens';

// A tag is "n:<node id>" (an inventory entity) or "r:<relationship id>" (a relationship).
const MAX_TAGS = 40;

/** Shows what a tag points to, or null if it no longer exists (deleted, or from another business). */
const unique = (v: string[]) => [...new Set(v)];

function useTagInfo() {
  const { t } = useTranslation();
  const { byId, relationships } = useInventory();
  return (tag: string): { label: string; open: string } | null => {
    const id = tag.slice(2);
    if (tag[0] === 'n') return byId[id] ? { label: byId[id].title, open: id } : null;
    const r = relationships.find((x) => x.id === id);
    return r && byId[r.from_node] && byId[r.to_node] ? { label: `${byId[r.from_node].title} ${t(`rel.${r.type}`)} ${byId[r.to_node].title}`, open: r.from_node } : null;
  };
}

/** Read-only list of tags. */
export function TagList({ value, onOpenNode }: { value: string[]; onOpenNode?: (id: string) => void }) {
  const info = useTagInfo();
  const shown = unique(value).map((v) => ({ v, i: info(v) })).filter((x) => x.i);
  if (!shown.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
      {shown.map(({ v, i }) => <Chip key={v} label={i!.label} onPress={onOpenNode ? () => onOpenNode(i!.open) : undefined} />)}
    </View>
  );
}

/** Tags on one field: pick any inventory entity or relationship, or create a new entity on the spot. */
export function TagPicker({ value, onChange, editable, onOpenNode }: { value: string[]; onChange: (v: string[]) => void; editable: boolean; onOpenNode: (id: string) => void }) {
  const { t } = useTranslation();
  const { nodes, relationships, byId, saveNode } = useInventory();
  const info = useTagInfo();
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const has = new Set(value);
  const full = value.length >= MAX_TAGS;
  const nodeOptions = nodes.filter((n) => !has.has(`n:${n.id}`) && (!q || n.title.toLowerCase().includes(q))).slice(0, 6);
  const relOptions = relationships
    .filter((r) => !has.has(`r:${r.id}`) && byId[r.from_node] && byId[r.to_node])
    .map((r) => ({ r, label: `${byId[r.from_node].title} ${t(`rel.${r.type}`)} ${byId[r.to_node].title}` }))
    .filter((x) => q && x.label.toLowerCase().includes(q))
    .slice(0, 4);
  const exact = nodes.some((n) => n.title.toLowerCase() === q);

  const add = (tag: string) => { onChange([...value, tag]); setAdding(false); setQuery(''); };
  const create = async (type: NodeType) => {
    setError(null);
    try { add(`n:${await saveNode({ type, subtype: null, title: query.trim(), description: null })}`); }
    catch (e: any) { setError(e?.message ?? t('common.error')); }
  };

  const shown = unique(value).map((v) => ({ v, i: info(v) })).filter((x) => x.i);
  if (!editable && !shown.length) return null;

  return (
    <View style={{ gap: space[3] }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'center' }}>
        {shown.map(({ v, i }) => (
          <Chip key={v} label={editable ? `${i!.label} ×` : i!.label} tone={editable ? 'danger' : undefined} accessibilityLabel={editable ? t('tags.remove', { name: i!.label }) : undefined}
            onPress={editable ? () => onChange(value.filter((x) => x !== v)) : () => onOpenNode(i!.open)} />
        ))}
        {editable && !adding && !full && <Chip label={`+ ${t('tags.add')}`} onPress={() => setAdding(true)} />}
      </View>
      {adding && (
        <View style={{ gap: space[3] }}>
          <Field label={t('tags.search')} value={query} onChangeText={setQuery} maxLength={200} placeholder={t('inventory.searchPlaceholder')} autoFocus />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {nodeOptions.map((n) => <Chip key={n.id} label={`${n.title} · ${t(`type.${n.type}`)}`} onPress={() => add(`n:${n.id}`)} />)}
            {relOptions.map((x) => <Chip key={x.r.id} label={x.label} onPress={() => add(`r:${x.r.id}`)} />)}
          </View>
          {!!q && !exact && (
            <View style={{ gap: space[2] }}>
              <Text variant="overline">{t('tags.createAs', { name: query.trim() })}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
                {NODE_TYPES.map((ty) => <Chip key={ty} label={t(`type.${ty}`)} selected onPress={() => create(ty)} />)}
              </View>
            </View>
          )}
          {error && <Text variant="error">{error}</Text>}
          <Button variant="ghost" label={t('common.cancel')} onPress={() => { setAdding(false); setQuery(''); }} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
        </View>
      )}
    </View>
  );
}
