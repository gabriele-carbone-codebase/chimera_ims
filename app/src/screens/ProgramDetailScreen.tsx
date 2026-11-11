import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { usePrograms, type ActivityView } from '../state/Programs';
import { canManageAll, canWrite, type NodeType } from '../lib/inventory';
import { BackButton, Button, Card, Chip, ConfirmButton, Field, NotFound, Page, Text, ViewOnly } from '../components/ui';
import { space } from '../theme/tokens';

type Cat = 'performers' | 'uses' | 'produces';
const CATS: Cat[] = ['performers', 'uses', 'produces'];
const CAT_TYPES: Record<Cat, NodeType[]> = { performers: ['person'], uses: ['resource'], produces: ['concept', 'resource', 'activity'] };
const CAT_NEW: Record<Cat, NodeType> = { performers: 'person', uses: 'resource', produces: 'concept' };
const CAT_LABEL: Record<Cat, string> = { performers: 'programs.performedBy', uses: 'programs.uses', produces: 'programs.produces' };

export function ProgramDetailScreen({ id, onBack, onOpenNode }: { id: string; onBack: () => void; onOpenNode: (id: string) => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId, deleteNode } = useInventory();
  const { programs, activitiesOf, addActivity } = usePrograms();
  const program = programs.find((p) => p.node_id === id);
  const node = byId[id];
  const role = current?.role;
  const [editing, setEditing] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!program || !node || !role) return <NotFound message={t('programs.notFound')} onBack={onBack} />;

  const writable = canWrite(role);
  const activities = activitiesOf(id);

  const add = async () => {
    setBusy(true); setError(null);
    try { await addActivity(id, newActivity.trim()); setNewActivity(''); }
    catch (e: any) { setError(e?.message ?? t('common.error')); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    try { await deleteNode(id); onBack(); } catch (e: any) { setError(e?.message ?? t('common.error')); }
  };

  return (
    <Page>
      <BackButton onBack={onBack} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{program.template_key ? `${t('programs.fromTemplate')} ${t(`tpl.${program.template_key}.name`)}` : t('programs.custom')}</Text>
        <Text variant="h1">{node.title}</Text>
        {node.description && <Text variant="secondary">{node.description}</Text>}
      </View>
      {error && <Text variant="error">{error}</Text>}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[4] }}>
        <Text variant="overline">{t('programs.activities')} · {activities.length}</Text>
        {writable && activities.length > 0 && <Button variant="secondary" label={editing ? t('programs.doneEditing') : t('programs.editLinks')} onPress={() => setEditing(!editing)} />}
      </View>
      {editing && <Text variant="secondary">{t('programs.removeHint')}</Text>}

      {activities.length === 0 && <Text variant="secondary">{t('programs.noActivities')}</Text>}
      {activities.map((a, i) => <ActivityCard key={a.node.id} index={i + 1} activity={a} editing={editing} writable={writable} onOpenNode={onOpenNode} />)}

      {writable && (
        <Card>
          <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}><Field label={t('programs.newActivity')} value={newActivity} onChangeText={setNewActivity} maxLength={200} onSubmitEditing={() => newActivity.trim() && add()} /></View>
            <Button variant="secondary" label={t('programs.addActivity')} onPress={add} loading={busy} disabled={!newActivity.trim()} />
          </View>
        </Card>
      )}

      {canManageAll(role) ? <ConfirmButton label={t('programs.delete')} message={t('programs.deleteHint')} onConfirm={remove} style={{ alignSelf: 'flex-start' }} /> : <ViewOnly />}
    </Page>
  );
}

function ActivityCard({ index, activity, editing, writable, onOpenNode }: { index: number; activity: ActivityView; editing: boolean; writable: boolean; onOpenNode: (id: string) => void }) {
  const { t } = useTranslation();
  const { deleteRelationship } = useInventory();
  const [adding, setAdding] = useState<Cat | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <Text variant="overline">{String(index).padStart(2, '0')}</Text>
      <Text variant="h3" onPress={() => onOpenNode(activity.node.id)}>{activity.node.title}</Text>
      {activity.node.description && <Text variant="secondary">{activity.node.description}</Text>}
      {error && <Text variant="error">{error}</Text>}

      <View style={{ gap: space[4], marginTop: space[3] }}>
        {CATS.map((cat) => (
          <View key={cat} style={{ gap: space[3] }}>
            <Text variant="overline">{t(CAT_LABEL[cat])}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'center' }}>
              {activity[cat].length === 0 && adding !== cat && <Text variant="secondary">{t('programs.nothingYet')}</Text>}
              {activity[cat].map(({ rel, node }) => (
                <Chip key={rel.id} label={editing ? `${node.title} ×` : node.title} tone={editing ? 'danger' : undefined}
                  onPress={() => (editing ? deleteRelationship(rel.id).catch((e: any) => setError(e?.message ?? t('common.error'))) : onOpenNode(node.id))} />
              ))}
              {writable && adding !== cat && <Chip label={`+ ${t('programs.add')}`} onPress={() => setAdding(cat)} />}
            </View>
            {adding === cat && <AddItem activity={activity} cat={cat} onClose={() => setAdding(null)} />}
          </View>
        ))}
      </View>
    </Card>
  );
}

function AddItem({ activity, cat, onClose }: { activity: ActivityView; cat: Cat; onClose: () => void }) {
  const { t } = useTranslation();
  const { nodes, saveNode, saveRelationship } = useInventory();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const linked = new Set(activity[cat].map((x) => x.node.id));
  const q = query.trim().toLowerCase();
  const options = nodes.filter((n) => CAT_TYPES[cat].includes(n.type) && n.id !== activity.node.id && n.subtype !== 'program' && !linked.has(n.id) && (!q || n.title.toLowerCase().includes(q))).slice(0, 8);
  const exact = nodes.some((n) => CAT_TYPES[cat].includes(n.type) && n.title.toLowerCase() === q);

  const link = async (itemId: string) => {
    setError(null);
    try {
      const a = activity.node.id;
      if (cat === 'performers') await saveRelationship({ from: itemId, to: a, type: 'performs', strength: 'strong' });
      else await saveRelationship({ from: a, to: itemId, type: cat === 'uses' ? 'uses' : 'produces', strength: 'strong' });
      onClose();
    } catch (e: any) { setError(e?.message ?? t('common.error')); }
  };
  const create = async () => {
    setError(null);
    try { await link(await saveNode({ type: CAT_NEW[cat], subtype: null, title: query.trim(), description: null })); }
    catch (e: any) { setError(e?.message ?? t('common.error')); }
  };

  return (
    <View style={{ gap: space[3] }}>
      <Field label={t('programs.searchExisting')} value={query} onChangeText={setQuery} maxLength={200} autoFocus />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        {options.map((n) => <Chip key={n.id} label={n.title} onPress={() => link(n.id)} />)}
        {q && !exact && <Chip label={t('programs.createNew', { name: query.trim() })} selected onPress={create} />}
      </View>
      {error && <Text variant="error">{error}</Text>}
      <Button variant="ghost" label={t('programs.cancel')} onPress={onClose} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
    </View>
  );
}
