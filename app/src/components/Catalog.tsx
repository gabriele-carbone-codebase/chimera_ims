import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { fontSize, fonts, radius, space } from '../theme/tokens';
import { PURPOSES, STAGES, type Purpose, type Stage, type TemplateDef } from '../lib/templates';
import { Text } from './ui';

/** Colored label for what a methodology is for. With `onPress` it is a filter button. The name is always written, so color is never the only signal. */
export function PurposePill({ purpose, selected, onPress }: { purpose: Purpose; selected?: boolean; onPress?: () => void }) {
  const { t } = useTranslation();
  const c = useTheme();
  const col = c.purpose[purpose];
  const body = (
    <View style={{ minHeight: onPress ? 44 : 24, paddingHorizontal: space[4], borderRadius: radius.pill, borderWidth: 1, borderColor: col.fg, backgroundColor: selected ? col.fg : col.bg, justifyContent: 'center', alignSelf: 'flex-start' }}>
      <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: selected ? col.bg : col.fg }}>{selected ? '✓ ' : ''}{t(`purpose.${purpose}`)}</RNText>
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}>{body}</Pressable> : body;
}

/** Neutral label for the stage a methodology fits. */
export function StageTag({ stage }: { stage: Stage }) {
  const { t } = useTranslation();
  const c = useTheme();
  return <Text variant="overline" style={{ color: c.textTertiary }}>{t(`methodStage.${stage}`)}</Text>;
}

/** Purposes and stage of one methodology; the main purpose comes first. */
export function CatalogLabels({ tpl }: { tpl: TemplateDef }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'center' }}>
      {tpl.purposes.map((p) => <PurposePill key={p} purpose={p} />)}
      <StageTag stage={tpl.stage} />
    </View>
  );
}

export { PURPOSES, STAGES };
