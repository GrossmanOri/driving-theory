import { Link } from 'react-router-dom';
import { getAllQuestions, getLessons, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { Stars } from '../components/Stars';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';
import { cheer, greeting } from '../lib/greeting';
import { challengeDoneToday } from '../lib/dailyChallenge';

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
      <h1 className="mb-1 text-3xl font-extrabold text-slate-800 dark:text-slate-100">{greeting(progress.name)} 👋</h1>
      <p className="mb-4 text-xl text-slate-500 dark:text-slate-400">{cheer(new Date().getDate())}</p>

      {/* Journey: the car drives (right → left) toward the 🏁 as progress grows */}
      <div className="relative mb-5 h-10">
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div
          className="absolute top-1/2 right-0 h-2 -translate-y-1/2 rounded-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-700"
          style={{ left: `calc(${100 - pct}% - 14px)` }}
        >
          🚗
        </span>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl">🏁</span>
      </div>

      {/* Lowest-friction start: just 5 questions, no decisions */}
      <Link
        to="/practice"
        className="mb-5 flex items-center justify-between rounded-3xl bg-gradient-to-l from-emerald-500 to-green-500 p-6 text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-green-600"
      >
        <div>
          <div className="text-2xl font-extrabold">✏️ בואו נתרגל</div>
          <div className="text-base opacity-90">רק 5 שאלות — בלי לחשוב מאיפה להתחיל</div>
        </div>
        <span className="text-3xl">←</span>
      </Link>

      {/* Daily challenge */}
      <Link
        to="/daily"
        className="mb-5 flex items-center justify-between rounded-3xl border-2 border-amber-200 bg-white p-4 shadow-sm transition hover:border-amber-300 dark:border-amber-500/30 dark:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">אתגר יומי</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {challengeDoneToday() ? 'הושלם להיום — כל הכבוד! ✅' : '7 שאלות + בונוס נקודות'}
            </div>
          </div>
        </div>
        <span className="text-2xl">{challengeDoneToday() ? '🏆' : '←'}</span>
      </Link>

      {/* Daily goal */}
      <div className="mb-5 rounded-3xl bg-gradient-to-l from-amber-100 to-amber-50 p-5 dark:from-amber-500/15 dark:to-amber-500/5">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-amber-700">
            {dailyDone ? 'כל הכבוד! סיימת את היעד היומי 🎉' : 'היעד היומי שלך'}
          </span>
          <span className="text-lg font-bold text-amber-600">
            {daily}/{DAILY_GOAL}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-amber-400 transition-all"
            style={{ width: `${(daily / DAILY_GOAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700 dark:text-slate-200">ההתקדמות שלך</span>
          <span className="text-lg font-bold text-green-600">{pct}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          אספת {mastered} מתוך {total} תמרורים ושאלות 🏆
        </p>
      </div>

      {/* Full theory test — prominent CTA */}
      <Link
        to="/exam"
        className="mb-6 flex items-center justify-between rounded-3xl bg-gradient-to-l from-sky-500 to-indigo-500 p-5 text-white shadow-md transition hover:from-sky-600 hover:to-indigo-600"
      >
        <div>
          <div className="text-2xl font-extrabold">🎓 מבחן תיאוריה מלא</div>
          <div className="text-base opacity-90">30 שאלות, 40 דקות — חדש בכל פעם</div>
        </div>
        <span className="text-3xl">←</span>
      </Link>

      {/* Topic map */}
      <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-100">הנושאים</h2>
      <div className="mb-6 grid gap-4">
        {topics.map((topic) => {
          const lessons = getLessons(topic.id);
          const shown = lessons.slice(0, 12); // big bank — show the first dozen
          return (
            <div key={topic.id} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{topic.name}</span>
                </div>
                <span className="text-base text-slate-400">{lessons.length} שיעורים</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {shown.map((_, i) => {
                  const key = `${topic.id}:${i}`;
                  const stars = progress.stars[key] ?? 0;
                  return (
                    <Link
                      key={key}
                      to={`/learn/${topic.id}/${i}`}
                      className="flex flex-col items-center gap-1 rounded-2xl border-2 border-sky-100 bg-sky-50 px-5 py-3 hover:border-sky-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-sky-500"
                    >
                      <span className="text-lg font-bold text-sky-700 dark:text-sky-300">שיעור {i + 1}</span>
                      <Stars count={stars} size="text-base" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          to="/review"
          className="rounded-3xl bg-sky-500 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-sky-600"
        >
          🔄 חזרה חכמה
        </Link>
        <Link
          to="/blitz"
          className="rounded-3xl bg-amber-500 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-amber-600"
        >
          ⚡ בליץ דקה
        </Link>
        <Link
          to="/flashcards"
          className="rounded-3xl bg-indigo-400 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-indigo-500"
        >
          🃏 כרטיסיות תמרורים
        </Link>
        <Link
          to="/focus"
          className="rounded-3xl bg-rose-400 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-rose-500"
        >
          🎯 תרגול ממוקד
        </Link>
        <Link
          to="/mistakes"
          className="rounded-3xl bg-purple-400 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-purple-500"
        >
          🔁 תרגול טעויות
          {progress.mistakes.length > 0 && (
            <span className="mr-2 rounded-full bg-white/30 px-2 text-base">{progress.mistakes.length}</span>
          )}
        </Link>
        <Link
          to="/collection"
          className="rounded-3xl bg-amber-400 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-amber-500"
        >
          🚸 אוסף התמרורים
        </Link>
        <Link
          to="/dashboard"
          className="rounded-3xl bg-emerald-400 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-emerald-500"
        >
          📊 הלוח שלי
        </Link>
        <Link
          to="/settings"
          className="rounded-3xl bg-slate-200 p-5 text-center text-xl font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-300"
        >
          ⚙️ הגדרות
        </Link>
      </div>
    </div>
  );
}
