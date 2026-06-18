import { Link } from 'react-router-dom';
import { getAllQuestions, getLessons, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { Stars } from '../components/Stars';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';
import { cheer, greeting } from '../lib/greeting';

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
      <h1 className="mb-1 text-3xl font-extrabold text-slate-800">{greeting(progress.name)} 👋</h1>
      <p className="mb-5 text-xl text-slate-500">{cheer(new Date().getDate())}</p>

      {/* Daily goal */}
      <div className="mb-5 rounded-3xl bg-gradient-to-l from-amber-100 to-amber-50 p-5">
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
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700">ההתקדמות שלך</span>
          <span className="text-lg font-bold text-green-600">{pct}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-base text-slate-500">
          אספת {mastered} מתוך {total} תמרורים ושאלות 🏆
        </p>
      </div>

      {/* Topic map */}
      <h2 className="mb-3 text-2xl font-bold text-slate-800">הנושאים</h2>
      <div className="mb-6 grid gap-4">
        {topics.map((topic) => {
          const lessons = getLessons(topic.id);
          const shown = lessons.slice(0, 12); // big bank — show the first dozen
          return (
            <div key={topic.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <span className="text-xl font-bold text-slate-800">{topic.name}</span>
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
                      className="flex flex-col items-center gap-1 rounded-2xl border-2 border-sky-100 bg-sky-50 px-5 py-3 hover:border-sky-300"
                    >
                      <span className="text-lg font-bold text-sky-700">שיעור {i + 1}</span>
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
          to="/exam"
          className="rounded-3xl bg-sky-500 p-5 text-center text-xl font-bold text-white shadow-md hover:bg-sky-600"
        >
          🎓 מבחן דמה
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
          to="/settings"
          className="rounded-3xl bg-slate-200 p-5 text-center text-xl font-bold text-slate-700 shadow-sm hover:bg-slate-300"
        >
          ⚙️ הגדרות
        </Link>
      </div>
    </div>
  );
}
