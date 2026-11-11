import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { Chip, ChipRow } from './ui';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useApp();
  return (
    <ChipRow kind="radio">
      <Chip label={t('settings.english')} selected={i18n.language === 'en'} onPress={() => setLanguage('en')} />
      <Chip label={t('settings.italian')} selected={i18n.language === 'it'} onPress={() => setLanguage('it')} />
    </ChipRow>
  );
}
