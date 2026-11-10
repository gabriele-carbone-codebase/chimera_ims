import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { Button, Field, Header, Screen, Text } from '../components/ui';

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
      <Header title={t('business.createTitle')} hint={t('business.createHint')} size="h2" />
      <Field label={t('business.name')} value={name} onChangeText={setName} onSubmitEditing={create} />
      {error && <Text variant="error">{error}</Text>}
      <Button label={t('business.create')} onPress={create} loading={busy} disabled={!name.trim()} />
      {onDone && <Button variant="ghost" label={t('common.cancel')} onPress={onDone} />}
    </Screen>
  );
}
