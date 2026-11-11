import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { Button, Header, Page, Text } from '../components/ui';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { space } from '../theme/tokens';

export function SettingsScreen({ go }: { go: (r: 'business' | 'expertise') => void }) {
  const { t } = useTranslation();
  const { current, signOut } = useApp();
  if (!current) return null;

  return (
    <Page>
      <Header title={t('settings.title')} size="h2" />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('home.role')}</Text>
        <Text>{t(`roles.${current.role}`)}</Text>
      </View>
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('home.level')}</Text>
        <Text>{current.expertise_level ? t(`expertise.${current.expertise_level}`) : '—'}</Text>
        <Button variant="secondary" label={t('settings.level')} onPress={() => go('expertise')} style={{ alignSelf: 'flex-start', marginTop: space[3] }} />
      </View>
      <Button variant="secondary" label={t('business.new')} onPress={() => go('business')} style={{ alignSelf: 'flex-start' }} />
      <View style={{ gap: space[3] }}>
        <Text variant="overline">{t('settings.language')}</Text>
        <LanguageSwitch />
      </View>
      <Button variant="ghost" label={t('auth.signOut')} onPress={signOut} style={{ alignSelf: 'flex-start' }} />
    </Page>
  );
}
