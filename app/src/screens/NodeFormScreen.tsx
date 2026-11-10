import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../state/Inventory';
import { NODE_TYPES, SUBTYPES, isManagedNode, type NodeType } from '../lib/inventory';
import { Button, Chip, Field, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function NodeFormScreen({ id, initialType, onDone, onCancel }: {
  id?: string; initialType: NodeType; onDone: (id: string) => void; onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { byId, saveNode } = useInventory();
  const existing = id ? byId[id] : undefined;
  const locked = !!existing && isManagedNode(existing);
  const [type, setType] = useState<NodeType>(existing?.type ?? initialType);
  const [subtype, setSubtype] = useState<string | null>(existing?.subtype ?? null);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true); setError(null);
    try {
      const savedId = await saveNode({ id, type, subtype, title: title.trim(), description: description.trim() || null });
      onDone(savedId);
    } catch (e: any) {
      setError(e?.message ?? t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <Text variant="h2">{existing ? t('form.editTitle') : t('form.newTitle')}</Text>

      {!locked && <>
      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('form.type')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {NODE_TYPES.map((ty) => (
            <Chip key={ty} label={t(`type.${ty}`)} selected={type === ty} onPress={() => { setType(ty); setSubtype(null); }} />
          ))}
        </View>
      </View>

      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('form.subtype')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          {SUBTYPES[type].map((s) => (
            <Chip key={s} label={t(`subtype.${s}`)} selected={subtype === s} onPress={() => setSubtype(subtype === s ? null : s)} />
          ))}
        </View>
      </View>
      </>}

      <Field label={t('form.name')} value={title} onChangeText={setTitle} maxLength={200} />
      <Field label={t('form.description')} value={description} onChangeText={setDescription} multiline maxLength={4000} />

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('form.save')} onPress={save} loading={busy} disabled={!title.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
