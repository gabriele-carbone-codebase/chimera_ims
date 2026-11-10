import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePrograms } from '../state/Programs';
import { TEMPLATES } from '../lib/templates';
import { Button, Card, Field, Header, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function ProgramNewScreen({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { createProgram } = usePrograms();
  const [choice, setChoice] = useState<string | null | undefined>(undefined); // undefined = nothing picked, null = scratch
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = (key: string | null) => {
    setChoice(key);
    setName(key ? t(`tpl.${key}.name`) : '');
    setDescription('');
  };

  const create = async () => {
    setBusy(true); setError(null);
    try {
      const desc = choice ? t(`tpl.${choice}.description`) : description.trim() || null;
      onDone(await createProgram((k) => t(k), choice ?? null, name.trim(), desc));
    } catch (e: any) {
      setError(e?.message ?? t('common.error')); setBusy(false);
    }
  };

  return (
    <Page>
      <Header title={t('programs.newTitle')} hint={t('programs.newHint')} size="h2" />

      <View style={{ gap: space[4] }}>
        {TEMPLATES.map((tpl) => (
          <Card key={tpl.key} selected={choice === tpl.key} onPress={() => pick(tpl.key)}>
            <Text variant="h3">{t(`tpl.${tpl.key}.name`)}</Text>
            <Text variant="secondary">{t(`tpl.${tpl.key}.description`)}</Text>
            <Text variant="overline">{t('programs.activitiesCount', { count: tpl.activities.length })}</Text>
          </Card>
        ))}
        <Card selected={choice === null} onPress={() => pick(null)}>
          <Text variant="h3">{t('programs.scratch')}</Text>
          <Text variant="secondary">{t('programs.scratchHint')}</Text>
        </Card>
      </View>

      {choice !== undefined && (
        <View style={{ gap: space[5] }}>
          <Field label={t('programs.name')} value={name} onChangeText={setName} maxLength={200} />
          {choice === null && <Field label={t('programs.description')} value={description} onChangeText={setDescription} multiline maxLength={4000} />}
          {error && <Text variant="error">{error}</Text>}
          <View style={{ flexDirection: 'row', gap: space[4] }}>
            <Button label={t('programs.create')} onPress={create} loading={busy} disabled={!name.trim()} />
            <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} />
          </View>
        </View>
      )}
      {choice === undefined && <Button variant="ghost" label={t('common.cancel')} onPress={onCancel} style={{ alignSelf: 'flex-start' }} />}
    </Page>
  );
}
