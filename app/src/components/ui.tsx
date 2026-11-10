import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text as RNText, TextInput, View, type TextInputProps, type TextProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fontSize, fonts, radius, space } from '../theme/tokens';

type Variant = 'body' | 'secondary' | 'overline' | 'h1' | 'h2' | 'h3' | 'error';

export function Text({ variant = 'body', style, ...p }: TextProps & { variant?: Variant }) {
  const c = useTheme();
  const base = {
    body: { fontFamily: fonts.body, fontSize: fontSize.body, color: c.text, lineHeight: 21 },
    secondary: { fontFamily: fonts.body, fontSize: fontSize.body, color: c.textTertiary, lineHeight: 21 },
    overline: { fontFamily: fonts.mono, fontSize: 11, color: c.textTertiary, letterSpacing: 0.9, textTransform: 'uppercase' as const },
    h1: { fontFamily: fonts.heading, fontSize: fontSize.h1, color: c.text, letterSpacing: -0.6 },
    h2: { fontFamily: fonts.heading, fontSize: fontSize.h2, color: c.text, letterSpacing: -0.4 },
    h3: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: c.text, letterSpacing: -0.2 },
    error: { fontFamily: fonts.body, fontSize: fontSize.sm, color: c.danger },
  }[variant];
  return <RNText style={[base, style]} {...p} />;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: {
  label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; loading?: boolean; disabled?: boolean; style?: ViewStyle;
}) {
  const c = useTheme();
  const v = {
    primary: { bg: c.action, fg: c.onAction, bd: c.action },
    secondary: { bg: c.card, fg: c.text, bd: c.border },
    ghost: { bg: 'transparent', fg: c.textSecondary, bd: 'transparent' },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable accessibilityRole="button" disabled={off} onPress={onPress}
      style={({ pressed }) => [s.btn, { backgroundColor: v.bg, borderColor: v.bd, opacity: off ? 0.45 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }, style]}>
      {loading ? <ActivityIndicator color={v.fg} /> : <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.body, color: v.fg }}>{label}</RNText>}
    </Pressable>
  );
}

export function Field({ label, ...p }: TextInputProps & { label: string }) {
  const c = useTheme();
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={{ gap: space[2] }}>
      <Text variant="overline">{label}</Text>
      <TextInput {...p} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholderTextColor={c.textDisabled}
        style={[s.input, p.multiline && { height: undefined, minHeight: 96, paddingTop: space[4], textAlignVertical: 'top' }, { backgroundColor: c.card, color: c.text, borderColor: focus ? c.focus : c.border, fontFamily: fonts.body }]} />
    </View>
  );
}

export function Chip({ label, selected, onPress, tone }: { label: string; selected?: boolean; onPress?: () => void; tone?: 'accent' | 'danger' }) {
  const c = useTheme();
  const bg = selected ? c.action : c.card;
  const fg = selected ? c.onAction : tone === 'danger' ? c.danger : c.textSecondary;
  const bd = selected ? c.action : c.border;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={!onPress}
      style={{ height: 30, paddingHorizontal: space[4], borderRadius: radius.pill, borderWidth: 1, borderColor: bd, backgroundColor: bg, justifyContent: 'center' }}>
      <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: fg }}>{label}</RNText>
    </Pressable>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ alignItems: 'center' }} keyboardShouldPersistTaps="handled">
      <View style={{ width: '100%', maxWidth: 720, padding: space[7], gap: space[6] }}>{children}</View>
    </ScrollView>
  );
}

export function Card({ children, selected, onPress, style }: { children: React.ReactNode; selected?: boolean; onPress?: () => void; style?: ViewStyle }) {
  const c = useTheme();
  const box = [s.card, { backgroundColor: selected ? c.selected : c.card, borderColor: selected ? c.accent : c.borderSubtle }, style];
  return onPress
    ? <Pressable accessibilityRole="button" onPress={onPress} style={box}>{children}</Pressable>
    : <View style={box}>{children}</View>;
}

export function Screen({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.page, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 520, padding: space[7], gap: space[6], justifyContent: 'center' }}>{children}</View>
    </View>
  );
}

/** Screen title with an optional one-line hint. */
export function Header({ title, hint, size = 'h1' }: { title: string; hint?: string; size?: 'h1' | 'h2' }) {
  return (
    <View style={{ gap: space[2] }}>
      <Text variant={size}>{title}</Text>
      {hint && <Text variant="secondary">{hint}</Text>}
    </View>
  );
}

export function BackButton({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return <Button variant="ghost" label={`← ${t('common.back')}`} onPress={onBack} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />;
}

export function NotFound({ message, onBack }: { message: string; onBack: () => void }) {
  const { t } = useTranslation();
  return <Page><Text variant="secondary">{message}</Text><Button variant="secondary" label={t('common.back')} onPress={onBack} /></Page>;
}

/** Runs an async action while tracking which one is busy (by key) and its error message. */
export function useAction() {
  const { t } = useTranslation();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key); setError(null);
    try { await fn(); } catch (e: any) { setError(e?.message ?? t('common.error')); } finally { setBusy(null); }
  };
  return { busy, error, run };
}

const s = StyleSheet.create({
  btn: { height: 40, paddingHorizontal: space[5], borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  input: { height: 40, paddingHorizontal: space[4], borderRadius: radius.md, borderWidth: 1, fontSize: fontSize.body },
  card: { padding: space[6], borderRadius: radius.md, borderWidth: 1, gap: space[2] },
});
