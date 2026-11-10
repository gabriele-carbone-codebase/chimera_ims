import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { REL_TYPES, STRENGTHS, canEdit, canWrite, type InvRel, type RelType, type Strength } from '../lib/inventory';
import { BackButton, Button, Card, Chip, Field, NotFound, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function NodeDetailScreen({ id, onOpen, onEdit, onBack }: { id: string; onOpen: (id: string) => void; onEdit: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  const { current, session } = useApp();
  const { nodes, relationships, byId, deleteNode, saveRelationship, deleteRelationship } = useInventory();
  const node = byId[id];
  const [confirming, setConfirming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = current?.role;
  const simple = current?.expertise_level === 'business_owner';
  const userId = session?.user.id;
  const mine = useMemo(() => relationships.filter((r) => r.from_node === id || r.to_node === id), [relationships, id]);

  if (!node || !role) return <NotFound message={t('detail.notFound')} onBack={onBack} />;

  const editable = canEdit(role, userId, node.created_by);
  const remove = async () => {
    if (!confirming) { setConfirming(true); return; }
    try { await deleteNode(id); onBack(); } catch (e: any) { setError(e?.message ?? t('common.error')); }
  };

  const relLabel = (r: InvRel) => (r.from_node === id ? t(`rel.${r.type}`) : t(`relInv.${r.type}`));

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t(`type.${node.type}`)}{node.subtype ? ` · ${t(`subtype.${node.subtype}`, { defaultValue: node.subtype })}` : ''}</Text>
        <Text variant="h1">{node.title}</Text>
        {node.description && <Text variant="secondary">{node.description}</Text>}
      </View>

      {editable && (
        <View style={{ flexDirection: 'row', gap: space[4] }}>
          <Button variant="secondary" label={t('detail.edit')} onPress={onEdit} />
          <Button variant="ghost" label={confirming ? t('detail.confirmDelete') : t('detail.delete')} onPress={remove} />
        </View>
      )}
      {error && <Text variant="error">{error}</Text>}

      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="overline">{t('detail.relationships')}</Text>
          {canWrite(role) && !adding && <Button variant="secondary" label={t('detail.addRelationship')} onPress={() => setAdding(true)} />}
        </View>

        {adding && (
          <AddRelationship
            nodeId={id}
            simple={simple}
            onCancel={() => setAdding(false)}
            onSave={async (input) => { await saveRelationship(input); setAdding(false); }}
          />
        )}

        {mine.length === 0 && !adding && <Text variant="secondary">{t('detail.noRelationships')}</Text>}
        {mine.map((r) => {
          const otherId = r.from_node === id ? r.to_node : r.from_node;
          const other = byId[otherId];
          if (!other) return null;
          const removable = canEdit(role, userId, r.created_by);
          return (
            <Card key={r.id} onPress={() => onOpen(otherId)}>
              <Text variant="overline">{simple ? t('detail.linkedTo') : relLabel(r)} · {t(`strength.${r.strength}`)}</Text>
              <Text variant="h3">{other.title}</Text>
              <Text variant="secondary">{t(`type.${other.type}`)}</Text>
              {removable && <Button variant="ghost" label={t('detail.removeRelationship')} onPress={() => deleteRelationship(r.id)} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />}
            </Card>
          );
        })}
        {nodes.length <= 1 && canWrite(role) && <Text variant="secondary">{t('detail.needTwo')}</Text>}
      </View>
    </Page>
  );
}

function AddRelationship({ nodeId, simple, onSave, onCancel }: {
  nodeId: string; simple: boolean;
  onSave: (i: { from: string; to: string; type: RelType; strength: Strength }) => Promise<void>; onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { nodes } = useInventory();
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState<string | null>(null);
  const [type, setType] = useState<RelType>('related_to');
  const [reverse, setReverse] = useState(false);
  const [strength, setStrength] = useState<Strength>('weak');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const options = nodes.filter((n) => n.id !== nodeId && (!q || n.title.toLowerCase().includes(q))).slice(0, 8);

  const save = async () => {
    if (!target) return;
    setBusy(true); setError(null);
    try { await onSave({ from: reverse ? target : nodeId, to: reverse ? nodeId : target, type, strength }); }
    catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Card>
      <Field label={t('detail.chooseTarget')} value={query} onChangeText={setQuery} placeholder={t('inventory.searchPlaceholder')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginVertical: space[3] }}>
        {options.map((n) => <Chip key={n.id} label={n.title} selected={target === n.id} onPress={() => setTarget(n.id)} />)}
        {options.length === 0 && <Text variant="secondary">{t('inventory.noResults')}</Text>}
      </View>

      {!simple && (
        <View style={{ gap: space[3], marginBottom: space[3] }}>
          <Text variant="overline">{t('detail.relationType')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {REL_TYPES.map((rt) => <Chip key={rt} label={t(reverse ? `relInv.${rt}` : `rel.${rt}`)} selected={type === rt} onPress={() => setType(rt)} />)}
          </View>
          <Chip label={t('detail.reverse')} selected={reverse} onPress={() => setReverse(!reverse)} />
        </View>
      )}

      <View style={{ gap: space[3], marginBottom: space[4] }}>
        <Text variant="overline">{t('detail.strength')}</Text>
        <View style={{ flexDirection: 'row', gap: space[3] }}>
          {STRENGTHS.map((s) => <Chip key={s} label={t(`strength.${s}`)} selected={strength === s} onPress={() => setStrength(s)} />)}
        </View>
      </View>

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('form.save')} onPress={save} loading={busy} disabled={!target} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Card>
  );
}
