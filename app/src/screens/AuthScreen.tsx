import React, { useRef, useState } from 'react';
import { View, type TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button, Field, Header, Screen, Text } from '../components/ui';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { space } from '../theme/tokens';

// Known Supabase auth error codes; anything else gets the generic message instead of raw server text.
const AUTH_ERRORS: Record<string, string> = { invalid_credentials: 'auth.badCredentials', weak_password: 'auth.weakPassword' };

export function AuthScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const emailRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const submit = async () => {
    if (!email || password.length < 6) return;
    setBusy(true); setError(null); setInfo(null);
    try {
      if (mode === 'in') {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() || undefined } } });
        if (e) throw e;
        if (!data.session) { setInfo(t('auth.checkEmail')); setMode('in'); }
      }
    } catch (e: any) {
      setError(t(AUTH_ERRORS[e?.code] ?? 'common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header title={t('app.name')} hint={t('app.tagline')} />
      <View style={{ gap: space[5] }}>
        {mode === 'up' && <Field label={t('auth.name')} value={name} onChangeText={setName} autoComplete="name" textContentType="name" returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => emailRef.current?.focus()} />}
        <Field ref={emailRef} label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress"
          returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => passwordRef.current?.focus()} />
        <View style={{ gap: space[2] }}>
          <Field ref={passwordRef} label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry={!show} autoCapitalize="none"
            autoComplete={mode === 'in' ? 'current-password' : 'new-password'} textContentType={mode === 'in' ? 'password' : 'newPassword'} returnKeyType="go" onSubmitEditing={submit} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] }}>
            <Text variant="secondary" style={{ flex: 1 }}>{t('auth.passwordHint')}</Text>
            <Button variant="ghost" label={show ? t('auth.hidePassword') : t('auth.showPassword')} onPress={() => setShow(!show)} />
          </View>
        </View>
        {error && <Text variant="error">{error}</Text>}
        {info && <Text variant="secondary" accessibilityLiveRegion="polite">{info}</Text>}
        <Button label={mode === 'in' ? t('auth.signIn') : t('auth.signUp')} onPress={submit} loading={busy} disabled={!email || password.length < 6} />
        <Button variant="ghost" label={mode === 'in' ? t('auth.noAccount') : t('auth.haveAccount')} onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(null); setInfo(null); }} />
        <LanguageSwitch />
      </View>
    </Screen>
  );
}
