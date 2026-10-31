import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { Button, Card, Text } from '../components/ui';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/tokens';

export function HomeScreen({ go }: { go: (r: 'business' | 'expertise') => void }) {
  const { t } = useTranslation();
  const c = useTheme();
  const { profile, memberships, current, selectBusiness, setLanguage, signOut } = useApp();
  if (!current) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720, padding: space[7], gap: space[7] }}>
        <View style={{ gap: space[2] }}>
          <Text variant="overline">{current.business.name}</Text>
          <Text variant="h1">{t('home.welcome', { name: profile?.display_name ?? '' })}</Text>
          <Text variant="secondary">{t('home.soon')}</Text>
        </View>

        <Card>
          <Text variant="overline">{t('home.role')}</Text>
          <Text>{t(`roles.${current.role}`)}</Text>
          <Text variant="overline" style={{ marginTop: space[4] }}>{t('home.level')}</Text>
          <Text>{current.expertise_level ? t(`expertise.${current.expertise_level}`) : '—'}</Text>
          <Button variant="secondary" label={t('settings.level')} onPress={() => go('expertise')} style={{ alignSelf: 'flex-start', marginTop: space[4] }} />
        </Card>

        <View style={{ gap: space[4] }}>
          <Text variant="overline">{t('business.switch')}</Text>
          {memberships.map((m) => (
            <Card key={m.business_id} selected={m.business_id === current.business_id} onPress={() => selectBusiness(m.business_id)}>
              <Text variant="h3">{m.business.name}</Text>
              <Text variant="secondary">{t(`roles.${m.role}`)}</Text>
            </Card>
          ))}
          <Button variant="secondary" label={t('business.new')} onPress={() => go('business')} style={{ alignSelf: 'flex-start' }} />
        </View>

        <View style={{ gap: space[4] }}>
          <Text variant="overline">{t('settings.language')}</Text>
          <View style={{ flexDirection: 'row', gap: space[3] }}>
            <Button variant={profile?.language === 'en' ? 'primary' : 'secondary'} label={t('settings.english')} onPress={() => setLanguage('en')} />
            <Button variant={profile?.language === 'it' ? 'primary' : 'secondary'} label={t('settings.italian')} onPress={() => setLanguage('it')} />
          </View>
        </View>

        <Button variant="ghost" label={t('auth.signOut')} onPress={signOut} style={{ alignSelf: 'flex-start' }} />
      </View>
    </ScrollView>
  );
}
