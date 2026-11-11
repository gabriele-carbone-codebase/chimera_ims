import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { usePrograms } from '../state/Programs';
import { canWrite } from '../lib/inventory';
import { Button, Card, Header, Page, Text, ViewOnly } from '../components/ui';
import { space } from '../theme/tokens';

export function ProgramsScreen({ onOpen, onNew }: { onOpen: (id: string) => void; onNew: () => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { programs, activitiesOf, loading } = usePrograms();

  const rows = programs.map((p) => ({ p, node: byId[p.node_id] })).filter((r) => r.node);

  return (
    <Page>
      <Header title={t('programs.title')} hint={t('programs.hint')} />

      {current && canWrite(current.role) ? <Button label={t('programs.new')} onPress={onNew} style={{ alignSelf: 'flex-start' }} /> : <ViewOnly />}

      {loading ? <Text variant="secondary">{t('common.loading')}</Text> : rows.length === 0 ? (
        <Card>
          <Text variant="h3">{t('programs.empty')}</Text>
          <Text variant="secondary">{t('programs.emptyHint')}</Text>
        </Card>
      ) : (
        <View style={{ gap: space[4] }}>
          {rows.map(({ p, node }) => (
            <Card key={p.node_id} onPress={() => onOpen(p.node_id)}>
              <Text variant="h3">{node.title}</Text>
              {node.description && <Text variant="secondary" numberOfLines={2}>{node.description}</Text>}
              <Text variant="overline">
                {p.template_key ? t(`tpl.${p.template_key}.name`) : t('programs.custom')} · {t('programs.activitiesCount', { count: activitiesOf(p.node_id).length })}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </Page>
  );
}
