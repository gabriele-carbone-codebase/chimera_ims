import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { fontSize, fonts, space } from '../theme/tokens';

export type Section = 'home' | 'inventory';

export function AppBar({ section, onSection, business }: { section: Section; onSection: (s: Section) => void; business: string }) {
  const { t } = useTranslation();
  const c = useTheme();
  return (
    <View style={{ backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.borderSubtle, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720, paddingHorizontal: space[7], height: 56, flexDirection: 'row', alignItems: 'center', gap: space[7] }}>
        <RNText style={{ fontFamily: fonts.heading, fontSize: 22, letterSpacing: -0.4, color: c.text }}>{t('app.name')}</RNText>
        <View style={{ flexDirection: 'row', gap: space[5], flex: 1 }}>
          {(['home', 'inventory'] as Section[]).map((s) => (
            <Pressable key={s} accessibilityRole="button" onPress={() => onSection(s)} style={{ height: 56, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: section === s ? c.accent : 'transparent' }}>
              <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.body, color: section === s ? c.text : c.textTertiary }}>{t(`nav.${s}`)}</RNText>
            </Pressable>
          ))}
        </View>
        <RNText numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.9, textTransform: 'uppercase', color: c.textTertiary, maxWidth: 160 }}>{business}</RNText>
      </View>
    </View>
  );
}
