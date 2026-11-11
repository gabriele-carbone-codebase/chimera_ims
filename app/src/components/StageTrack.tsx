import React from 'react';
import { Text as RNText, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { STAGES, type ProjectStage } from '../lib/projects';
import { useTheme } from '../theme/ThemeProvider';
import { fonts, radius, space } from '../theme/tokens';

/** Four-step track: define, build, test, shipped. Steps up to the current one are filled. */
export function StageTrack({ stage, muted }: { stage: ProjectStage; muted?: boolean }) {
  const { t } = useTranslation();
  const c = useTheme();
  const at = STAGES.indexOf(stage);
  return (
    <View style={{ flexDirection: 'row', gap: space[2] }}>
      {STAGES.map((s, i) => {
        const done = i <= at;
        return (
          <View key={s} style={{ flex: 1, gap: space[2] }}>
            <View style={{ height: 4, borderRadius: radius.pill, backgroundColor: done ? (muted ? c.borderStrong : c.accent) : c.borderSubtle }} />
            <RNText numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: i === at ? c.text : c.textTertiary }}>{t(`stage.${s}`)}</RNText>
          </View>
        );
      })}
    </View>
  );
}
