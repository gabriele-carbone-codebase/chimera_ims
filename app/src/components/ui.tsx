import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text as RNText, TextInput, View, type AccessibilityRole, type TextInputProps, type TextProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fontSize, fonts, radius, space } from '../theme/tokens';

type Variant = 'body' | 'secondary' | 'overline' | 'h1' | 'h2' | 'h3' | 'error';

type Role = 'radio' | 'checkbox' | 'tab';

export function Text({ variant = 'body', style, ...p }: TextProps & { variant?: Variant }) {
  const c = useTheme();
  const base = {
    body: { fontFamily: fonts.body, fontSize: fontSize.body, color: c.text, lineHeight: 21 },
    secondary: { fontFamily: fonts.body, fontSize: fontSize.body, color: c.textTertiary, lineHeight: 21 },
    overline: { fontFamily: fonts.mono, fontSize: 12, color: c.textTertiary, letterSpacing: 0.9, textTransform: 'uppercase' as const },
    h1: { fontFamily: fonts.heading, fontSize: fontSize.h1, color: c.text, letterSpacing: -0.6 },
    h2: { fontFamily: fonts.heading, fontSize: fontSize.h2, color: c.text, letterSpacing: -0.4 },
    h3: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: c.text, letterSpacing: -0.2 },
    error: { fontFamily: fonts.body, fontSize: fontSize.sm, color: c.danger },
  }[variant];
  const a11y: TextProps = variant === 'error' ? { accessibilityRole: 'alert', accessibilityLiveRegion: 'polite' } : variant[0] === 'h' ? { accessibilityRole: 'header' } : {};
  return <RNText style={[base, style]} {...a11y} {...p} />;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style, accessibilityLabel, accessibilityRole }: {
  label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; loading?: boolean; disabled?: boolean; style?: ViewStyle;
  accessibilityLabel?: string; accessibilityRole?: AccessibilityRole;
}) {
  const { t } = useTranslation();
  const c = useTheme();
  const v = {
    primary: { bg: c.action, fg: c.onAction, bd: c.action },
    secondary: { bg: c.card, fg: c.text, bd: c.border },
    ghost: { bg: 'transparent', fg: c.textSecondary, bd: 'transparent' },
    danger: { bg: c.danger, fg: c.onAction, bd: c.danger },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable accessibilityRole={accessibilityRole ?? 'button'} accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled: off, busy: loading }} disabled={off} onPress={onPress}
      style={({ pressed }) => [s.btn, { backgroundColor: v.bg, borderColor: v.bd, opacity: off ? 0.45 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }, style]}>
      {loading ? <ActivityIndicator color={v.fg} accessibilityLabel={t('common.loading')} /> : <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.body, color: v.fg }}>{label}</RNText>}
    </Pressable>
  );
}

export function Field({ label, ref, ...p }: TextInputProps & { label: string; ref?: React.Ref<React.ComponentRef<typeof TextInput>> }) {
  const c = useTheme();
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={{ gap: space[2] }}>
      <Text variant="overline">{label}</Text>
      <TextInput ref={ref} accessibilityLabel={label} {...p} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholderTextColor={c.textTertiary}
        style={[s.input, p.multiline && { minHeight: 96, paddingTop: space[4], textAlignVertical: 'top' }, { backgroundColor: c.card, color: c.text, borderColor: focus ? c.focus : c.borderStrong, fontFamily: fonts.body }]} />
    </View>
  );
}

export function Chip({ label, selected, onPress, tone, accessibilityRole, accessibilityLabel }: {
  label: string; selected?: boolean; onPress?: () => void; tone?: 'accent' | 'danger'; accessibilityRole?: AccessibilityRole; accessibilityLabel?: string;
}) {
  const c = useTheme();
  const bg = selected ? c.action : c.card;
  const fg = selected ? c.onAction : tone === 'danger' ? c.danger : c.textSecondary;
  const bd = selected ? c.action : c.borderStrong;
  return (
    <Pressable accessibilityRole={accessibilityRole ?? 'button'} accessibilityLabel={accessibilityLabel} accessibilityState={{ selected, disabled: !onPress }} onPress={onPress} disabled={!onPress}
      style={{ minHeight: 44, paddingHorizontal: space[4], borderRadius: radius.pill, borderWidth: 1, borderColor: bd, backgroundColor: bg, justifyContent: 'center' }}>
      <RNText style={{ fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: fg }}>
        {selected && <RNText accessibilityElementsHidden importantForAccessibility="no-hide-descendants">✓ </RNText>}{label}
      </RNText>
    </Pressable>
  );
}

/** Drop-down list for choosing one of many options. Opens inline (no overlay, so it works in the side menu) and gets a filter box when the list is long. */
export function Select({ label, value, options, onChange }: { label: string; value: string | undefined; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  const c = useTheme();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const shown = options.filter((o) => !q.trim() || o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const current = options.find((o) => o.value === value);
  return (
    <View style={{ gap: space[2] }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${current?.label ?? ''}`} accessibilityState={{ expanded: open }} onPress={() => { setOpen(!open); setQ(''); }}
        style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3], paddingHorizontal: space[4], borderRadius: radius.md, borderWidth: 1, borderColor: open ? c.focus : c.borderStrong, backgroundColor: c.card }}>
        <RNText numberOfLines={1} style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: fontSize.body, color: c.text }}>{current?.label ?? '—'}</RNText>
        <RNText accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color: c.textTertiary }}>{open ? '▴' : '▾'}</RNText>
      </Pressable>
      {open && (
        <View style={{ borderRadius: radius.md, borderWidth: 1, borderColor: c.borderStrong, backgroundColor: c.card, overflow: 'hidden' }}>
          {options.length > 8 && <TextInput accessibilityLabel={t('common.search')} placeholder={t('common.search')} value={q} onChangeText={setQ} placeholderTextColor={c.textTertiary}
            style={{ minHeight: 44, paddingHorizontal: space[4], color: c.text, fontFamily: fonts.body, borderBottomWidth: 1, borderBottomColor: c.borderSubtle }} />}
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {shown.map((o) => (
              <Pressable key={o.value} accessibilityRole="menuitem" accessibilityState={{ selected: o.value === value }} onPress={() => { onChange(o.value); setOpen(false); }}
                style={({ hovered }: any) => ({ minHeight: 44, justifyContent: 'center', paddingHorizontal: space[4], backgroundColor: hovered ? c.hover : 'transparent' })}>
                <RNText numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: fontSize.body, color: c.text }}>{o.value === value ? '✓ ' : ''}{o.label}</RNText>
              </Pressable>
            ))}
            {shown.length === 0 && <RNText style={{ padding: space[4], fontFamily: fonts.body, fontSize: fontSize.sm, color: c.textTertiary }}>{t('common.noResults')}</RNText>}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/** Wrapping row of chips. `kind` gives the group its role and passes it to every Chip inside (single choice, multi select or tabs). */
export function ChipRow({ kind, children }: { kind?: Role; children: React.ReactNode }) {
  const role = kind && { radio: 'radiogroup', checkbox: undefined, tab: 'tablist' }[kind];
  return (
    <View accessibilityRole={role as AccessibilityRole | undefined} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
      {kind ? React.Children.map(children, (ch) => (React.isValidElement<{ accessibilityRole?: AccessibilityRole }>(ch) && ch.type === Chip && !ch.props.accessibilityRole ? React.cloneElement(ch, { accessibilityRole: kind }) : ch)) : children}
    </View>
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

export function Card({ children, selected, onPress, style, accessibilityRole }: { children: React.ReactNode; selected?: boolean; onPress?: () => void; style?: ViewStyle; accessibilityRole?: AccessibilityRole }) {
  const c = useTheme();
  const box = [s.card, { backgroundColor: selected ? c.selected : c.card, borderColor: selected ? c.accent : c.borderSubtle }, style];
  return onPress
    ? <Pressable accessibilityRole={accessibilityRole ?? 'button'} accessibilityState={{ selected }} onPress={onPress} style={box}>{children}</Pressable>
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
  return <Button variant="ghost" label={`← ${t('common.back')}`} accessibilityLabel={t('common.back')} onPress={onBack} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />;
}

export function NotFound({ message, onBack }: { message: string; onBack: () => void }) {
  const { t } = useTranslation();
  return <Page><Text variant="secondary">{message}</Text><Button variant="secondary" label={t('common.back')} onPress={onBack} /></Page>;
}

/** One-line note shown where an action is hidden because of the user's role. */
export function ViewOnly() {
  const { t } = useTranslation();
  return <Text variant="secondary">{t('common.viewOnly')}</Text>;
}

/** Checkbox row (or switch) with a 44px touch target. Without onPress it is read-only. */
export function CheckRow({ label, checked, onPress, role = 'checkbox' }: { label: string; checked: boolean; onPress?: () => void; role?: 'checkbox' | 'switch' }) {
  const c = useTheme();
  const sw = role === 'switch';
  return (
    <Pressable accessibilityRole={role} accessibilityState={{ checked, disabled: !onPress }} disabled={!onPress} onPress={onPress}
      style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
      <View style={{ width: sw ? 42 : 24, height: 24, borderRadius: sw ? 12 : radius.sm, borderWidth: 1, borderColor: checked ? c.action : c.borderStrong, backgroundColor: checked ? c.action : c.card, justifyContent: 'center', paddingHorizontal: sw ? 2 : 0 }}>
        {sw ? <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: checked ? c.onAction : c.borderStrong, alignSelf: checked ? 'flex-end' : 'flex-start' }} />
          : checked && <RNText style={{ color: c.onAction, fontSize: fontSize.body, textAlign: 'center' }}>✓</RNText>}
      </View>
      <Text style={{ flex: 1 }}>{label}</Text>
    </Pressable>
  );
}

/** Destructive or irreversible action: the first tap asks, naming the consequence; it resets itself after 5 seconds. */
export function ConfirmButton({ label, message, confirmLabel, onConfirm, variant = 'ghost', loading, disabled, style }: {
  label: string; message: string; confirmLabel?: string; onConfirm: () => void; variant?: 'primary' | 'secondary' | 'ghost'; loading?: boolean; disabled?: boolean; style?: ViewStyle;
}) {
  const { t } = useTranslation();
  const [asking, setAsking] = React.useState(false);
  React.useEffect(() => {
    if (!asking) return;
    const id = setTimeout(() => setAsking(false), 5000);
    return () => clearTimeout(id);
  }, [asking]);
  if (!asking) return <Button variant={variant} label={label} loading={loading} disabled={disabled} style={style} onPress={() => setAsking(true)} />;
  return (
    <View accessibilityLiveRegion="polite" style={[{ gap: space[3] }, style]}>
      <Text variant="secondary">{message}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
        <Button variant="danger" label={confirmLabel ?? t('common.delete')} onPress={() => { setAsking(false); onConfirm(); }} />
        <Button variant="ghost" label={t('common.cancel')} onPress={() => setAsking(false)} />
      </View>
    </View>
  );
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
  btn: { minHeight: 44, paddingHorizontal: space[5], borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 44, paddingHorizontal: space[4], borderRadius: radius.md, borderWidth: 1, fontSize: fontSize.body },
  card: { padding: space[6], borderRadius: radius.md, borderWidth: 1, gap: space[2] },
});
