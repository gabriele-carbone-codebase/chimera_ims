import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIdeas } from '../state/Ideas';
import { Button, Card, Chip, Field, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function IdeaFormScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { submitIdea } = useIdeas();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setBusy(true); setError(null);
    try { onDone(await submitIdea(title.trim(), description.trim() || null, anonymous)); }
    catch (e: any) { setError(e?.message ?? t('common.error')); setBusy(false); }
  };

  return (
    <Page>
      <View style={{ gap: space[2] }}>
        <Text variant="h2">{t('ideas.formTitle')}</Text>
        <Text variant="secondary">{t('ideas.formHint')}</Text>
      </View>

      <Field label={t('ideas.fieldTitle')} value={title} onChangeText={setTitle} maxLength={200} placeholder={t('ideas.fieldTitlePlaceholder')} />
      <Field label={t('ideas.fieldDescription')} value={description} onChangeText={setDescription} multiline maxLength={4000} placeholder={t('ideas.fieldDescriptionPlaceholder')} />

      <Card selected={anonymous}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[4] }}>
          <View style={{ flex: 1, gap: space[2] }}>
            <Text variant="h3">{t('ideas.anonymousTitle')}</Text>
            <Text variant="secondary">{anonymous ? t('ideas.anonymousOn') : t('ideas.anonymousOff')}</Text>
          </View>
          <Chip label={anonymous ? t('ideas.yes') : t('ideas.no')} selected={anonymous} onPress={() => setAnonymous(!anonymous)} />
        </View>
      </Card>

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('ideas.send')} onPress={send} loading={busy} disabled={!title.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
