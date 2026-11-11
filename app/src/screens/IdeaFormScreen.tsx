import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIdeas } from '../state/Ideas';
import { BackButton, Button, CheckRow, Field, Header, Page, Text } from '../components/ui';
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
      <BackButton onBack={onCancel} />
      <Header title={t('ideas.formTitle')} hint={t('ideas.formHint')} size="h2" />

      <Field label={t('ideas.fieldTitle')} value={title} onChangeText={setTitle} maxLength={200} placeholder={t('ideas.fieldTitlePlaceholder')} />
      <Field label={t('ideas.fieldDescription')} value={description} onChangeText={setDescription} multiline maxLength={4000} placeholder={t('ideas.fieldDescriptionPlaceholder')} />

      <View style={{ gap: space[2] }}>
        <CheckRow role="switch" label={t('ideas.anonymousTitle')} checked={anonymous} onPress={() => setAnonymous(!anonymous)} />
        <Text variant="secondary">{t('ideas.anonymousHint')}</Text>
      </View>

      {error && <Text variant="error">{error}</Text>}
      <View style={{ flexDirection: 'row', gap: space[4] }}>
        <Button label={t('ideas.send')} onPress={send} loading={busy} disabled={!title.trim()} />
        <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
      </View>
    </Page>
  );
}
