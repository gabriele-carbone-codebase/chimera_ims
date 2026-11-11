import React from 'react';
import { Text as RNText, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { fonts, radius, space } from '../theme/tokens';

export const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function ProgressBar({ value, tone }: { value: number; tone?: 'ok' | 'risk' | 'done' }) {
  const c = useTheme();
  const color = tone === 'risk' ? c.warning : tone === 'done' ? c.success : c.accent;
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: pct }} style={{ height: 6, borderRadius: radius.pill, backgroundColor: c.borderSubtle, overflow: 'hidden' }}>
      <View style={{ height: 6, width: `${pct}%`, backgroundColor: color }} />
    </View>
  );
}

/** Small bar history of the last values (oldest to newest). */
export function MiniBars({ points }: { points: { label: string; value: number }[] }) {
  const c = useTheme();
  const { t } = useTranslation();
  const last = points.slice(-14);
  const max = Math.max(1e-9, ...last.map((p) => p.value));
  if (!last.length) return null;
  return (
    <View accessible accessibilityLabel={t('common.chartSummary', { count: last.length, last: fmt(last[last.length - 1].value), max: fmt(Math.max(...last.map((p) => p.value))) })}
      style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[2], height: 72 }}>
      {last.map((p, i) => (
        <View key={`${p.label}-${i}`} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 72, gap: 2 }}>
          <View style={{ width: '100%', height: Math.max(3, (p.value / max) * 56), backgroundColor: i === last.length - 1 ? c.accent : c.borderStrong, borderRadius: radius.sm }} />
          <RNText numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 11, color: c.textTertiary }}>{(last.length - 1 - i) % 2 === 0 ? p.label : ''}</RNText>
        </View>
      ))}
    </View>
  );
}
