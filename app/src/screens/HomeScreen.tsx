import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { AttentionCard } from './NotificationsScreen';
import type { Attention, Target } from '../state/Notifications';
import { Button, Text } from '../components/ui';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/tokens';

export function HomeScreen({ attention, onOpenTarget, onSeeAll }: { attention: Attention[]; onOpenTarget: (t: Target) => void; onSeeAll: () => void }) {
  const { t } = useTranslation();
  const c = useTheme();
  const { profile, current } = useApp();
  if (!current) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720, padding: space[7], gap: space[7] }}>
        <View style={{ gap: space[2] }}>
          <Text variant="overline">{current.business.name}</Text>
          <Text variant="h1">{t('home.welcome', { name: profile?.display_name ?? '' })}</Text>
        </View>

        <View style={{ gap: space[4] }}>
          <Text variant="overline">{t('home.attention')}</Text>
          {attention.length === 0 && <Text variant="secondary">{t('notif.empty')}</Text>}
          {attention.map((a) => <AttentionCard key={a.key} item={a} onOpen={onOpenTarget} />)}
          {attention.length > 0 && <Button variant="ghost" label={t('home.seeAll')} onPress={onSeeAll} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />}
        </View>
      </View>
    </ScrollView>
  );
}
