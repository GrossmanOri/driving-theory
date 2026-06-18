import { Link } from 'react-router-dom';
import { getAllQuestions, getQuestionById, getQuestionsByTopic, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { isDue } from '../lib/leitner';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';

function Ring({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#34c759"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="68" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#1f2430">
        {pct}%
      </text>
    </svg>
  );
}

export function Dashboard() {
  const { progress, totalStars } = useProgressContext();
  const all = getAllQuestions();
  const total = all.length;
  const mastered = progress.mastered.length;
  const pct = total ? Math.round((mastered / total) * 100) : 0;

  // Per-topic mastery.
  const topics = getTopics().map((t) => {
    const qs = getQuestionsByTopic(t.id);
    const done = qs.filter((q) => progress.mastered.includes(q.id)).length;
    return { ...t, done, total: qs.length };
  });

  // What's next: questions seen and now due for review (Leitner).
  const dueCount = Object.entries(progress.cards).filter(
    ([id, card]) => getQuestionById(id) && isDue(card) && !progress.mastered.includes(id),
  ).length;
  const daily = Math.min(getDailyCount(), DAILY_GOAL);

  // Sign collection.
  const signs = getQuestionsByTopic('signs').filter((q) => q.imageUrl);
  const signsCollected = signs.filter((q) => progress.mastered.includes(q.id)).length;

  // Rewards / badges.
  const badges = [
    { id: 'first', label: 'צעד ראשון', icon: '🌱', unlocked: mastered >= 1 },
    { id: 'ten', label: '10 שאלות', icon: '🔟', unlocked: mastered >= 10 },
    { id: 'fifty', label: '50 שאלות', icon: '💪', unlocked: mastered >= 50 },
    { id: 'signs', label: 'אספנית תמרורים', icon: '🚸', unlocked: signsCollected >= 20 },
    { id: 'stars', label: '15 כוכבים', icon: '⭐', unlocked: totalStars >= 15 },
    { id: 'hundred', label: '100 שאלות', icon: '🏆', unlocked: mastered >= 100 },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-5 text-3xl font-extrabold text-slate-800">הלוח שלי 📊</h1>

      {/* What you did */}
      <div className="mb-6 flex items-center gap-5 rounded-3xl bg-white p-5 shadow-sm">
        <Ring pct={pct} />
        <div className="flex-1">
          <p className="text-lg text-slate-500">אספת עד עכשיו</p>
          <p className="text-2xl font-extrabold text-slate-800">{mastered} שאלות 🏆</p>
          <div className="mt-2 flex gap-3 text-lg font-bold">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">⭐ {totalStars}</span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-green-600">{progress.points} נק׳</span>
          </div>
        </div>
      </div>

      {/* Per-topic */}
      <h2 className="mb-3 text-2xl font-bold text-slate-800">לפי נושא</h2>
      <div className="mb-6 grid gap-3">
        {topics.map((t) => {
          const p = t.total ? Math.round((t.done / t.total) * 100) : 0;
          return (
            <div key={t.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700">
                  {t.icon} {t.name}
                </span>
                <span className="text-base text-slate-500">
                  {t.done}/{t.total}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-400" style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* What's next */}
      <h2 className="mb-3 text-2xl font-bold text-slate-800">מה הלאה</h2>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-purple-50 p-4 text-center">
          <div className="text-3xl font-extrabold text-purple-600">{dueCount}</div>
          <div className="text-base text-slate-600">לחזרה היום</div>
        </div>
        <Link to="/mistakes" className="rounded-2xl bg-amber-50 p-4 text-center hover:bg-amber-100">
          <div className="text-3xl font-extrabold text-amber-600">{progress.mistakes.length}</div>
          <div className="text-base text-slate-600">טעויות לתרגל</div>
        </Link>
        <div className="rounded-2xl bg-green-50 p-4 text-center">
          <div className="text-3xl font-extrabold text-green-600">
            {daily}/{DAILY_GOAL}
          </div>
          <div className="text-base text-slate-600">יעד יומי</div>
        </div>
      </div>

      {/* Sign collection */}
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700">🚸 אוסף התמרורים</span>
          <span className="text-base text-slate-500">
            {signsCollected}/{signs.length}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-amber-400"
            style={{ width: `${signs.length ? (signsCollected / signs.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Rewards */}
      <h2 className="mb-3 text-2xl font-bold text-slate-800">הישגים 🎖️</h2>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col items-center gap-1 rounded-2xl p-4 text-center ${
              b.unlocked ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-50 grayscale'
            }`}
          >
            <span className="text-4xl">{b.icon}</span>
            <span className="text-sm font-semibold text-slate-600">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
