import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button, Field, Screen, Text } from '../components/ui';
import { space } from '../theme/tokens';

export function AuthScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
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
      setError(e?.message ?? t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={{ gap: space[2] }}>
        <Text variant="h1">{t('app.name')}</Text>
        <Text variant="secondary">{t('app.tagline')}</Text>
      </View>
      <View style={{ gap: space[5] }}>
        {mode === 'up' && <Field label={t('auth.name')} value={name} onChangeText={setName} autoComplete="name" />}
        <Field label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Field label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry autoComplete={mode === 'in' ? 'current-password' : 'new-password'} onSubmitEditing={submit} />
        {error && <Text variant="error">{error}</Text>}
        {info && <Text variant="secondary">{info}</Text>}
        <Button label={mode === 'in' ? t('auth.signIn') : t('auth.signUp')} onPress={submit} loading={busy} disabled={!email || password.length < 6} />
        <Button variant="ghost" label={mode === 'in' ? t('auth.noAccount') : t('auth.haveAccount')} onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(null); }} />
      </View>
    </Screen>
  );
}
