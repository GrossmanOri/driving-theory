import { Link } from 'react-router-dom';
import { getAllQuestions, getLessons, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { Card, CardLink } from '../components/Card';
import { HeroScene } from '../components/HeroScene';
import {
  IconArrowLeft,
  IconChart,
  IconGraduation,
  IconLayers,
  IconPencil,
  IconRotate,
  IconSettings,
  IconSigns,
  IconStar,
  IconTarget,
  IconTrophy,
  IconZap,
} from '../components/Icons';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';
import { cheer, greeting } from '../lib/greeting';
import { challengeDoneToday } from '../lib/dailyChallenge';

// Curated tint map — literal class strings so Tailwind v4 keeps them at build time.
const MODES = [
  {
    to: '/review',
    Icon: IconRotate,
    label: 'חזרה חכמה',
    caption: 'לרענן את מה שלמדת',
    chip: 'bg-sky-100 dark:bg-sky-500/15',
    icon: 'text-sky-600 dark:text-sky-300',
  },
  {
    to: '/blitz',
    Icon: IconZap,
    label: 'בליץ דקה',
    caption: 'כמה תספיקו בדקה?',
    chip: 'bg-amber-100 dark:bg-amber-500/15',
    icon: 'text-amber-600 dark:text-amber-300',
  },
  {
    to: '/flashcards',
    Icon: IconLayers,
    label: 'כרטיסיות תמרורים',
    caption: 'תמרור, הפוך, פירוש',
    chip: 'bg-indigo-100 dark:bg-indigo-500/15',
    icon: 'text-indigo-600 dark:text-indigo-300',
  },
  {
    to: '/focus',
    Icon: IconTarget,
    label: 'תרגול ממוקד',
    caption: 'מחזקים את הנושא החלש',
    chip: 'bg-rose-100 dark:bg-rose-500/15',
    icon: 'text-rose-600 dark:text-rose-300',
  },
  {
    to: '/mistakes',
    Icon: IconRotate,
    label: 'תרגול טעויות',
    caption: 'הטעויות הופכות לחוזקות',
    badge: 'mistakes',
    chip: 'bg-purple-100 dark:bg-purple-500/15',
    icon: 'text-purple-600 dark:text-purple-300',
  },
  {
    to: '/collection',
    Icon: IconSigns,
    label: 'אוסף התמרורים',
    caption: 'האוסף שלך גדל עם כל שליטה',
    chip: 'bg-emerald-100 dark:bg-emerald-500/15',
    icon: 'text-emerald-600 dark:text-emerald-300',
    collection: true,
  },
  {
    to: '/dashboard',
    Icon: IconChart,
    label: 'הלוח שלי',
    caption: 'כל ההתקדמות במקום אחד',
    chip: 'bg-cyan-100 dark:bg-cyan-500/15',
    icon: 'text-cyan-600 dark:text-cyan-300',
  },
  {
    to: '/settings',
    Icon: IconSettings,
    label: 'הגדרות',
    caption: 'התאמה אישית',
    chip: 'bg-slate-100 dark:bg-slate-500/15',
    icon: 'text-slate-600 dark:text-slate-300',
  },
];

// Stable, de-duplicated sign imagery from the bank (first-N-unique).
function uniqueSigns() {
  const seen = new Set();
  const out = [];
  for (const q of getAllQuestions()) {
    if (!q.imageUrl || seen.has(q.imageUrl)) continue;
    seen.add(q.imageUrl);
    out.push(q.imageUrl);
  }
  return out;
}

export function Home() {
  const { progress } = useProgressContext();
  const topics = getTopics();
  const total = getAllQuestions().length;
  const mastered = progress.mastered.length;
  const pct = total ? Math.round((mastered / total) * 100) : 0;
  const daily = Math.min(getDailyCount(), DAILY_GOAL);
  const dailyDone = daily >= DAILY_GOAL;

  const signs = uniqueSigns();
  const collectionThumbs = signs.slice(0, 3);
  const signCount = signs.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {greeting(progress.name)} <span className="align-middle">👋</span>
      </h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{cheer(new Date().getDate())}</p>

      {/* Journey: תיאו drives (right → left) toward the flag as progress grows */}
      <div className="mb-5">
        <HeroScene pct={pct} />
      </div>

      {/* Hero CTAs: practice (lowest friction) + full exam, side by side on sm+ */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/practice"
          className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-600 p-5 text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-500/40 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <IconPencil size={26} className="shrink-0" />
            <div>
              <div className="text-xl font-bold">בואו נתרגל</div>
              <div className="text-sm opacity-90">רק 5 שאלות — בלי לחשוב מאיפה להתחיל</div>
            </div>
          </div>
          <IconArrowLeft size={24} className="shrink-0" />
        </Link>
        <Link
          to="/exam"
          className="flex items-center justify-between gap-3 rounded-2xl bg-sky-600 p-5 text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <IconGraduation size={26} className="shrink-0" />
            <div>
              <div className="text-xl font-bold">מבחן תיאוריה מלא</div>
              <div className="text-sm opacity-90">30 שאלות, 40 דקות — חדש בכל פעם</div>
            </div>
          </div>
          <IconArrowLeft size={24} className="shrink-0" />
        </Link>
      </div>

      {/* Daily challenge */}
      <CardLink to="/daily" className="mb-5 flex items-center justify-between transition hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <IconTarget size={26} />
          </span>
          <div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">אתגר יומי</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {challengeDoneToday() ? 'הושלם להיום — כל הכבוד! ✅' : '7 שאלות + בונוס נקודות'}
            </div>
          </div>
        </div>
        {challengeDoneToday() ? (
          <IconTrophy size={24} className="shrink-0 text-amber-500" />
        ) : (
          <IconArrowLeft size={24} className="shrink-0 text-amber-500" />
        )}
      </CardLink>

      {/* Progress row: daily goal + overall, side by side on sm+ */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
              <IconTarget size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                  {dailyDone ? 'היעד היומי הושלם 🎉' : 'היעד היומי'}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-300">
                  {daily}/{DAILY_GOAL}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${(daily / DAILY_GOAL) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
              <IconTrophy size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-700 dark:text-slate-200">ההתקדמות שלך</span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {mastered} מתוך {total} תמרורים ושאלות
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Topic map — lessons as a wall of numbered nodes */}
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">הנושאים</h2>
      <div className="mb-6 grid gap-4">
        {topics.map((topic) => {
          const lessons = getLessons(topic.id);
          const shown = lessons.slice(0, 12); // big bank — show the first dozen
          const doneCount = shown.filter(
            (_, i) => (progress.stars[`${topic.id}:${i}`] ?? 0) > 0
          ).length;
          const topicPct = shown.length ? Math.round((doneCount / shown.length) * 100) : 0;
          return (
            <Card key={topic.id}>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{topic.name}</span>
                    <span className="text-xs text-slate-400">
                      {doneCount}/{shown.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {shown.map((_, i) => {
                  const key = `${topic.id}:${i}`;
                  const stars = progress.stars[key] ?? 0;
                  const has = stars > 0;
                  return (
                    <Link
                      key={key}
                      to={`/learn/${topic.id}/${i}`}
                      aria-label={`שיעור ${i + 1}`}
                      className={`flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full border-2 font-bold transition hover:border-sky-400 ${
                        has
                          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
                          : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base leading-none">{i + 1}</span>
                      {has && (
                        <span className="flex gap-0.5">
                          {Array.from({ length: stars }).map((_, s) => (
                            <IconStar key={s} size={10} fill="currentColor" className="text-amber-500" />
                          ))}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODES.map(({ to, Icon, label, caption, badge, chip, icon, collection }) => {
          const count = badge === 'mistakes' ? progress.mistakes.length : 0;
          return (
            <CardLink key={to} to={to} className="flex items-center gap-4 transition hover:-translate-y-0.5">
              {collection && collectionThumbs.length > 0 ? (
                <span className="flex shrink-0 items-center -space-x-2 space-x-reverse">
                  {collectionThumbs.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt="תמרור"
                      loading="lazy"
                      className="h-8 w-8 rounded-md border border-slate-200/70 bg-white object-contain p-0.5 dark:border-slate-700"
                    />
                  ))}
                </span>
              ) : (
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${chip} ${icon}`}>
                  <Icon size={26} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {collection ? `${caption} · ${signCount}` : caption}
                </div>
              </div>
              {count > 0 && (
                <span className="rounded-full bg-purple-100 px-3 py-0.5 text-base font-bold text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                  {count}
                </span>
              )}
            </CardLink>
          );
        })}
      </div>
    </div>
  );
}
