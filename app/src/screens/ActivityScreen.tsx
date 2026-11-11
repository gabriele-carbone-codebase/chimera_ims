import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../state/AppState';
import { useInventory } from '../state/Inventory';
import { usePrograms } from '../state/Programs';
import { canWrite } from '../lib/inventory';
import { TagList, TagPicker } from '../components/TagPicker';
import { Guide, guideOf, useGuide } from '../components/Guide';
import { BackButton, Button, Card, Chip, Field, NotFound, Page, Text, ViewOnly } from '../components/ui';
import { space } from '../theme/tokens';

const fmt = (m: number) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);

/** The work screen of one activity: the sections of its document to fill in, the time limit if it has one, then complete it. */
export function ActivityScreen({ programId, id, onBack, onOpenActivity, onOpenNode }: { programId: string; id: string; onBack: () => void; onOpenActivity: (id: string) => void; onOpenNode: (id: string) => void }) {
  const { t } = useTranslation();
  const { current } = useApp();
  const { byId } = useInventory();
  const { programs, activitiesOf, workOf, startWork, saveWork } = usePrograms();
  const program = programs.find((p) => p.node_id === programId);
  const list = activitiesOf(programId);
  const index = list.findIndex((a) => a.node.id === id);
  const activity = list[index];
  const work = workOf(id);
  const writable = !!current && canWrite(current.role);
  const ref = activity && program ? guideOf(program.template_key, activity.position) : null;
  const guide = useGuide(ref);
  const prev = index > 0 ? list[index - 1] : undefined;
  const prevGuide = useGuide(prev && program ? guideOf(program.template_key, prev.position) : null);
  const prevWork = prev ? workOf(prev.node.id) : undefined;
  const [prevOpen, setPrevOpen] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(work?.answers ?? {}).filter(([, v]) => typeof v === 'string')));
  const [tags, setTags] = useState<Record<string, string[]>>(() => Object.fromEntries(Object.entries(work?.tags ?? {}).filter(([, v]) => Array.isArray(v))));
  const [guideOpen, setGuideOpen] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => { if (writable && activity && !work) startWork(id).catch((e: any) => setError(e?.message ?? t('common.error'))); }, [id, writable, !!activity]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const x = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(x); }, []);

  if (!program || !activity || !byId[id]) return <NotFound message={t('programs.notFound')} onBack={onBack} />;

  const done = work?.status === 'done';
  const next = list[index + 1];
  const sections = guide && guide.template.length ? guide.template.map((label, i) => ({ key: String(i), label })) : [{ key: 'notes', label: t('activity.notes') }];

  // Time limit: counted from the moment the activity was started.
  const limitEnd = ref?.minutes && work ? new Date(work.started_at).getTime() + ref.minutes * 60000 : null;
  const left = limitEnd ? Math.round((limitEnd - now) / 60000) : null;

  const run = async (completes: boolean, then?: () => void) => {
    setBusy(true); setError(null);
    try {
      if (writable) await saveWork(id, answers, tags, completes || done);
      if (!completes) { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000); }
      then?.();
    } catch (e: any) { setError(e?.message ?? t('common.error')); }
    finally { setBusy(false); }
  };

  // Opening a tagged entity leaves this screen, so the draft is saved first.
  const openNode = (nodeId: string) => (writable ? run(false, () => onOpenNode(nodeId)) : onOpenNode(nodeId));

  return (
    <Page>
      <BackButton onBack={() => (writable ? run(false, onBack) : onBack())} />
      <View style={{ gap: space[2] }}>
        <Text variant="overline">{t('activity.of', { n: index + 1, total: list.length })}{done ? ` · ✓ ${t('activity.completed')}` : ''}</Text>
        <Text variant="h1">{activity.node.title}</Text>
        {activity.node.description && <Text variant="secondary">{activity.node.description}</Text>}
      </View>

      {prev && (
        <Card selected>
          <Text variant="overline">{t('activity.input')}</Text>
          <Text variant="secondary">{t('activity.inputHint', { title: prev.node.title })}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[2] }}>
            {prev.produces.length === 0 && <Text variant="secondary">{t('programs.nothingYet')}</Text>}
            {prev.produces.map(({ rel, node }) => <Chip key={rel.id} label={node.title} />)}
          </View>
          {prevWork?.status !== 'done' && <Text variant="secondary">{t('activity.prevNotDone')}</Text>}
          {prevWork && Object.values(prevWork.answers).some((v) => typeof v === 'string' && v.trim()) && (
            <>
              <Button variant="ghost" label={t(prevOpen ? 'activity.hidePrev' : 'activity.showPrev')} onPress={() => setPrevOpen(!prevOpen)} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
              {prevOpen && Object.entries(prevWork.answers).filter(([, v]) => typeof v === 'string' && v.trim()).map(([k, v]) => (
                <View key={k} style={{ gap: space[1] }}>
                  <Text variant="overline">{prevGuide?.template[Number(k)] ?? t('activity.notes')}</Text>
                  <Text>{v}</Text>
                  <TagList value={prevWork.tags?.[k] ?? []} onOpenNode={openNode} />
                </View>
              ))}
            </>
          )}
        </Card>
      )}

      {ref?.minutes && (
        <Card>
          <Text variant="overline">{t('activity.limit')}</Text>
          <Text variant="h3">{fmt(ref.minutes)}</Text>
          {left !== null && !done && <Text variant={left < 0 ? 'error' : 'secondary'}>{left < 0 ? t('activity.overdue', { value: fmt(-left) }) : t('activity.remaining', { value: fmt(left) })}</Text>}
        </Card>
      )}

      {guide && (
        <View>
          <Button variant="ghost" label={guideOpen ? t('guide.hide') : t('guide.show')} onPress={() => setGuideOpen(!guideOpen)} style={{ alignSelf: 'flex-start', paddingHorizontal: 0 }} />
          {guideOpen && <Guide guide={guide} withTemplate={false} />}
        </View>
      )}

      <View style={{ gap: space[5] }}>
        {sections.map((s) => (
          <View key={s.key} style={{ gap: space[3] }}>
            <Field label={s.label} value={answers[s.key] ?? ''} onChangeText={(v) => setAnswers((a) => ({ ...a, [s.key]: v }))} multiline maxLength={4000} editable={writable} />
            <TagPicker value={tags[s.key] ?? []} onChange={(v) => setTags((x) => ({ ...x, [s.key]: v }))} editable={writable} onOpenNode={openNode} />
          </View>
        ))}
      </View>

      {error && <Text variant="error">{error}</Text>}
      {savedMsg && <Text variant="secondary" accessibilityLiveRegion="polite">{t('common.saved')}</Text>}

      {writable ? (
        <View style={{ gap: space[4] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4] }}>
            {next && <Button label={t('activity.completeNext')} loading={busy} onPress={() => run(true, () => onOpenActivity(next.node.id))} />}
            <Button variant={next ? 'secondary' : 'primary'} label={t('activity.completeBack')} loading={busy} onPress={() => run(true, onBack)} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4] }}>
            <Button variant="ghost" label={t('activity.save')} loading={busy} onPress={() => run(false)} />
            {next && done && <Button variant="ghost" label={t('activity.goNext')} onPress={() => onOpenActivity(next.node.id)} />}
          </View>
        </View>
      ) : <ViewOnly />}
    </Page>
  );
}
