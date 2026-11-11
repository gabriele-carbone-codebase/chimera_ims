import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TEMPLATES } from '../lib/templates';
import { Text } from './ui';
import { space } from '../theme/tokens';

export type GuideRef = { key: string; id: string; minutes?: number };

/** Template activities are created in order, so the position of an activity says which guide belongs to it. */
export function guideOf(templateKey: string | null, position: number | null): GuideRef | null {
  const tpl = TEMPLATES.find((x) => x.key === templateKey);
  const a = tpl && position ? tpl.activities[position - 1] : undefined;
  return tpl && a ? { key: tpl.key, id: a.id, minutes: a.minutes } : null;
}

/** Texts of a guide, or null when the activity has none. */
export function useGuide(ref: GuideRef | null) {
  const { t } = useTranslation();
  if (!ref) return null;
  const base = `tpl.${ref.key}.activities.${ref.id}.guide`;
  const why = t(`${base}.why`, { defaultValue: '' });
  if (!why) return null;
  const list = (k: string) => t(`${base}.${k}`, { returnObjects: true, defaultValue: [] }) as unknown as string[];
  return { why, steps: list('steps'), template: list('template'), done: t(`${base}.done`, { defaultValue: '' }) };
}

/** Reading material for an activity. `withTemplate` is off on the activity screen, where the template sections are the fields to fill. */
export function Guide({ guide, withTemplate = true }: { guide: NonNullable<ReturnType<typeof useGuide>>; withTemplate?: boolean }) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: space[4], marginTop: space[3] }}>
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('guide.why')}</Text>
        <Text>{guide.why}</Text>
      </View>
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('guide.steps')}</Text>
        {guide.steps.map((x, i) => <Text key={i}>{i + 1}. {x}</Text>)}
      </View>
      {withTemplate && (
        <View style={{ gap: space[2] }}>
          <Text variant="overline">{t('guide.template')}</Text>
          {guide.template.map((x, i) => <Text key={i}>– {x}</Text>)}
        </View>
      )}
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('guide.done')}</Text>
        <Text>{guide.done}</Text>
      </View>
    </View>
  );
}
