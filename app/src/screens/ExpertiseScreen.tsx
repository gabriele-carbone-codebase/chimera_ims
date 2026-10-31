import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import type { Level } from '../lib/supabase';
import { Button, Card, Screen, Text } from '../components/ui';
import { space } from '../theme/tokens';

export const LEVELS: Level[] = ['business_owner', 'technician', 'specialist', 'manager'];

export function ExpertiseScreen({ onDone }: { onDone?: () => void }) {
  const { t } = useTranslation();
  const { current, setExpertise } = useApp();
  const [level, setLevel] = useState<Level | null>(current?.expertise_level ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!level) return;
    setBusy(true); setError(null);
    try { await setExpertise(level); onDone?.(); }
    catch (e: any) { setError(e?.message ?? t('common.error')); }
    finally { setBusy(false); }
  };

  return (
    <Screen>
      <View style={{ gap: space[2] }}>
        <Text variant="h2">{t('expertise.title')}</Text>
        <Text variant="secondary">{t('expertise.hint')}</Text>
      </View>
      <View style={{ gap: space[4] }}>
        {LEVELS.map((l) => (
          <Card key={l} selected={level === l} onPress={() => setLevel(l)}>
            <Text variant="h3">{t(`expertise.${l}`)}</Text>
            <Text variant="secondary">{t(`expertise.${l}_desc`)}</Text>
          </Card>
        ))}
      </View>
      {error && <Text variant="error">{error}</Text>}
      <Button label={t('expertise.save')} onPress={save} loading={busy} disabled={!level} />
      {onDone && <Button variant="ghost" label={t('common.cancel')} onPress={onDone} />}
    </Screen>
  );
}
