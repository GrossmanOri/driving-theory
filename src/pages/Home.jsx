import { Link } from 'react-router-dom';
import { getAllQuestions, getLessons, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { Stars } from '../components/Stars';
import { Card, CardLink } from '../components/Card';
import {
  IconArrowLeft,
  IconCar,
  IconChart,
  IconFlag,
  IconGraduation,
  IconLayers,
  IconPencil,
  IconRotate,
  IconSettings,
  IconSigns,
  IconTarget,
  IconTrophy,
  IconZap,
} from '../components/Icons';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';
import { cheer, greeting } from '../lib/greeting';
import { challengeDoneToday } from '../lib/dailyChallenge';

const MODES = [
  { to: '/review', Icon: IconRotate, label: 'חזרה חכמה' },
  { to: '/blitz', Icon: IconZap, label: 'בליץ דקה' },
  { to: '/flashcards', Icon: IconLayers, label: 'כרטיסיות תמרורים' },
  { to: '/focus', Icon: IconTarget, label: 'תרגול ממוקד' },
  { to: '/mistakes', Icon: IconRotate, label: 'תרגול טעויות', badge: 'mistakes' },
  { to: '/collection', Icon: IconSigns, label: 'אוסף התמרורים' },
  { to: '/dashboard', Icon: IconChart, label: 'הלוח שלי' },
  { to: '/settings', Icon: IconSettings, label: 'הגדרות' },
];

export function Home() {
  const { progress } = useProgressContext();
  const topics = getTopics();
  const total = getAllQuestions().length;
  const mastered = progress.mastered.length;
  const pct = total ? Math.round((mastered / total) * 100) : 0;
  const daily = Math.min(getDailyCount(), DAILY_GOAL);
  const dailyDone = daily >= DAILY_GOAL;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{greeting(progress.name)}</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{cheer(new Date().getDate())}</p>

      {/* Journey: the car drives (right → left) toward the flag as progress grows */}
      <div className="relative mb-5 h-10">
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div
          className="absolute top-1/2 right-0 h-2 -translate-y-1/2 rounded-full bg-sky-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 text-sky-600 transition-all duration-700 dark:text-sky-400"
          style={{ left: `calc(${100 - pct}% - 12px)` }}
        >
          <IconCar size={24} />
        </span>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 text-slate-400">
          <IconFlag size={22} />
        </span>
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
      <CardLink to="/daily" className="mb-5 flex items-center justify-between">
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

      {/* Daily goal */}
      <Card className="mb-5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {dailyDone ? 'כל הכבוד! סיימת את היעד היומי 🎉' : 'היעד היומי שלך'}
          </span>
          <span className="text-base font-bold text-amber-600 dark:text-amber-300">
            {daily}/{DAILY_GOAL}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${(daily / DAILY_GOAL) * 100}%` }}
          />
        </div>
      </Card>

      {/* Overall progress */}
      <Card className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700 dark:text-slate-200">ההתקדמות שלך</span>
          <span className="text-base font-bold text-sky-600 dark:text-sky-400">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full rounded-full bg-sky-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          אספת {mastered} מתוך {total} תמרורים ושאלות 🏆
        </p>
      </Card>

      {/* Topic map */}
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">הנושאים</h2>
      <div className="mb-6 grid gap-4">
        {topics.map((topic) => {
          const lessons = getLessons(topic.id);
          const shown = lessons.slice(0, 12); // big bank — show the first dozen
          return (
            <Card key={topic.id}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{topic.name}</span>
                </div>
                <span className="text-sm text-slate-400">{lessons.length} שיעורים</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {shown.map((_, i) => {
                  const key = `${topic.id}:${i}`;
                  const stars = progress.stars[key] ?? 0;
                  return (
                    <Link
                      key={key}
                      to={`/learn/${topic.id}/${i}`}
                      className="flex flex-col items-center gap-1 rounded-xl border border-slate-200/70 bg-white px-5 py-3 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-500"
                    >
                      <span className="text-lg font-bold text-sky-700 dark:text-sky-300">שיעור {i + 1}</span>
                      <Stars count={stars} size="text-base" />
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
        {MODES.map(({ to, Icon, label, badge }) => {
          const count = badge === 'mistakes' ? progress.mistakes.length : 0;
          return (
            <CardLink key={to} to={to} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sky-600 dark:bg-slate-700 dark:text-sky-400">
                <Icon size={26} />
              </span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{label}</span>
              {count > 0 && (
                <span className="mr-auto rounded-full bg-purple-100 px-3 py-0.5 text-base font-bold text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
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
