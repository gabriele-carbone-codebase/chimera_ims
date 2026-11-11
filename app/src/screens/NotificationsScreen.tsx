import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNotifications, type Attention, type Target } from '../state/Notifications';
import { Button, Card, Header, Page, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function AttentionCard({ item, onOpen }: { item: Attention; onOpen: (t: Target) => void }) {
  const { t } = useTranslation();
  const { dismiss } = useNotifications();
  const title = t(`notif.${item.kind}.title`, item.params);
  return (
    <Card>
      <Text variant="overline">{t(`notif.${item.kind}.label`)}</Text>
      <Text variant="h3">{title}</Text>
      <Text variant="secondary">{t(`notif.${item.kind}.body`, item.params)}</Text>
      <View style={{ flexDirection: 'row', gap: space[3], marginTop: space[3] }}>
        <Button variant="secondary" label={t('notif.open')} accessibilityLabel={`${t('notif.open')}: ${title}`} onPress={() => onOpen(item.target)} />
        <Button variant="ghost" label={t('notif.dismiss')} accessibilityLabel={`${t('notif.dismiss')}: ${title}`} onPress={() => dismiss(item.key)} />
      </View>
    </Card>
  );
}

export function NotificationsScreen({ onOpen }: { onOpen: (t: Target) => void }) {
  const { t } = useTranslation();
  const { items, dismissAll } = useNotifications();
  return (
    <Page>
      <Header title={t('notif.title')} hint={t('notif.hint')} />
      {items.length > 0 && <Button variant="secondary" label={t('notif.dismissAll')} onPress={dismissAll} style={{ alignSelf: 'flex-start' }} />}
      {items.length === 0 ? (
        <Card><Text variant="h3">{t('notif.empty')}</Text><Text variant="secondary">{t('notif.emptyHint')}</Text></Card>
      ) : (
        <View style={{ gap: space[4] }}>{items.map((i) => <AttentionCard key={i.key} item={i} onOpen={onOpen} />)}</View>
      )}
    </Page>
  );
}
