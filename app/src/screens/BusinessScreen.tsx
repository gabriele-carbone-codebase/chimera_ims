import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { Button, Field, Screen, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function BusinessScreen({ onDone }: { onDone?: () => void }) {
  const { t } = useTranslation();
  const { createBusiness } = useApp();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setBusy(true); setError(null);
    try { await createBusiness(name.trim()); onDone?.(); }
    catch (e: any) { setError(e?.message ?? t('common.error')); }
    finally { setBusy(false); }
  };

  return (
    <Screen>
      <View style={{ gap: space[2] }}>
        <Text variant="h2">{t('business.createTitle')}</Text>
        <Text variant="secondary">{t('business.createHint')}</Text>
      </View>
      <Field label={t('business.name')} value={name} onChangeText={setName} onSubmitEditing={create} />
      {error && <Text variant="error">{error}</Text>}
      <Button label={t('business.create')} onPress={create} loading={busy} disabled={!name.trim()} />
      {onDone && <Button variant="ghost" label={t('common.cancel')} onPress={onDone} />}
    </Screen>
  );
}
