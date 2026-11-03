import React, { useState } from 'react';
import { Pressable, Text as RNText, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { fontSize, fonts, radius, space } from '../theme/tokens';

export type Section = 'home' | 'notifications' | 'goals' | 'programs' | 'ideas' | 'projects' | 'inventory' | 'strategy';
const SIDEBAR_WIDTH = 240;
const WIDE = 900;

type MenuProps = { section: Section; sections: Section[]; badges: Partial<Record<Section, number>>; onSection: (s: Section) => void; business: string; onPick?: () => void };

function Menu({ section, sections, badges, onSection, business, onPick }: MenuProps) {
  const { t } = useTranslation();
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.sunken, padding: space[5], gap: space[7] }}>
      <View style={{ gap: space[2], paddingHorizontal: space[3], paddingTop: space[3] }}>
        <RNText style={{ fontFamily: fonts.heading, fontSize: 24, letterSpacing: -0.5, color: c.text }}>{t('app.name')}</RNText>
        <RNText numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.9, textTransform: 'uppercase', color: c.textTertiary }}>{business}</RNText>
      </View>
      <View style={{ gap: space[2] }}>
        {sections.map((s) => {
          const active = section === s;
          const badge = badges[s];
          return (
            <Pressable key={s} accessibilityRole="button" onPress={() => { onSection(s); onPick?.(); }}
              style={({ hovered }: any) => ({ height: 36, borderRadius: radius.md, paddingHorizontal: space[4], justifyContent: 'center', backgroundColor: active ? c.card : hovered ? c.hover : 'transparent', borderWidth: 1, borderColor: active ? c.borderSubtle : 'transparent' })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.body, color: active ? c.text : c.textSecondary }}>{active ? '● ' : ''}{t(`nav.${s}`)}</RNText>
                {!!badge && (
                  <View style={{ minWidth: 20, height: 20, borderRadius: radius.pill, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                    <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: c.onAccent }}>{badge}</RNText>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Side menu on wide screens; on narrow screens a slim top bar that opens the same menu as a drawer. */
export function AppShell({ section, sections, badges, onSection, business, children }: {
  section: Section; sections: Section[]; badges: Partial<Record<Section, number>>; onSection: (s: Section) => void; business: string; children: React.ReactNode;
}) {
  const c = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const total = Object.values(badges).reduce((a, b) => a + (b ?? 0), 0);

  if (width >= WIDE) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: SIDEBAR_WIDTH, borderRightWidth: 1, borderRightColor: c.borderSubtle }}>
          <Menu section={section} sections={sections} badges={badges} onSection={onSection} business={business} />
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', gap: space[5], paddingHorizontal: space[5], backgroundColor: c.sunken, borderBottomWidth: 1, borderBottomColor: c.borderSubtle }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('nav.menu')} onPress={() => setOpen(!open)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <RNText style={{ fontSize: 22, color: c.text }}>{open ? '×' : '☰'}</RNText>
        </Pressable>
        <RNText style={{ fontFamily: fonts.heading, fontSize: 20, letterSpacing: -0.4, color: c.text }}>{t('app.name')}</RNText>
        <RNText numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.9, textTransform: 'uppercase', color: c.textTertiary }}>{t(`nav.${section}`)}{total ? ` · ${total}` : ''}</RNText>
      </View>
      <View style={{ flex: 1 }}>
        {children}
        {open && (
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, flexDirection: 'row' }}>
            <View style={{ width: SIDEBAR_WIDTH, borderRightWidth: 1, borderRightColor: c.borderSubtle }}>
              <Menu section={section} sections={sections} badges={badges} onSection={onSection} business={business} onPick={() => setOpen(false)} />
            </View>
            <Pressable accessibilityRole="button" onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: c.scrim }} />
          </View>
        )}
      </View>
    </View>
  );
}
