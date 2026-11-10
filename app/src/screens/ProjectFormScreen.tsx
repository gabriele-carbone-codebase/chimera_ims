import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../state/Projects';
import { Button, Field, Header, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function ProjectFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { createProject } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setBusy(true); setError(null);
    try { onDone(await createProject(title.trim(), description.trim() || null)); }
    catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Page>
      <Header title={t('projects.formTitle')} hint={t('projects.formHint')} size="h2" />
      <Field label={t('projects.fieldName')} value={title} onChangeText={setTitle} maxLength={200} />
      <Field label={t('projects.fieldDescription')} value={description} onChangeText={setDescription} multiline maxLength={4000} />
      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('projects.create')} onPress={create} loading={busy} disabled={!title.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
