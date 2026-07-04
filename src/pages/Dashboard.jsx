import { getAllQuestions, getQuestionById, getQuestionsByTopic, getTopics } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { Card, CardLink } from '../components/Card';
import { IconArrowLeft, IconFlame, IconPencil, IconRotate, IconSigns, IconStar, IconTarget } from '../components/Icons';
import { isDue } from '../lib/leitner';
import { DAILY_GOAL, getDailyCount } from '../lib/dailyGoal';
import { greeting } from '../lib/greeting';
import { levelInfo } from '../lib/levels';
import { getStreak } from '../lib/streak';

function Ring({ pct }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-700" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#0284c7"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="68" textAnchor="middle" fontSize="26" fontWeight="bold" className="fill-slate-800 dark:fill-slate-100">
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
  const level = levelInfo(progress.points);
  const streak = getStreak();

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
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{greeting(progress.name)}</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">הנה כמה רחוק הגעת</p>

      {/* What you did */}
      <Card className="mb-6 flex items-center gap-5">
        <Ring pct={pct} />
        <div className="flex-1">
          <p className="text-lg text-slate-500 dark:text-slate-400">אספת עד עכשיו</p>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{mastered} שאלות 🏆</p>
          <div className="mt-2 flex gap-2 text-base font-bold">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <IconStar size={18} fill="currentColor" className="text-amber-400" /> {totalStars}
            </span>
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
              {progress.points} נק׳
            </span>
          </div>
        </div>
      </Card>

      {/* Level + streak */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-sky-600 p-5 text-white shadow-sm sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xl font-bold">
              {level.rank.icon} {level.rank.name}
            </span>
            <span className="text-base opacity-90">דרגה {level.levelNumber}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/30">
            <div className="h-full rounded-full bg-white" style={{ width: `${level.progressPct}%` }} />
          </div>
          <p className="mt-2 text-sm opacity-90">
            {level.next
              ? `עוד ${level.xpForLevel - level.xpIntoLevel} נק׳ ל"${level.next.name}"`
              : 'הגעת לדרגה הגבוהה ביותר! 🏆'}
          </p>
        </div>
        <Card className="flex flex-col items-center justify-center">
          <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
            <IconFlame size={28} />
          </span>
          <div className="text-3xl font-bold text-orange-500">{streak}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">ימים ברצף</div>
        </Card>
      </div>

      {/* Per-topic */}
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">לפי נושא</h2>
      <div className="mb-6 grid gap-3">
        {topics.map((t) => {
          const p = t.total ? Math.round((t.done / t.total) * 100) : 0;
          return (
            <Card key={t.id} className="!p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  {t.icon} {t.name}
                </span>
                <span className="text-base text-slate-500 dark:text-slate-400">
                  {t.done}/{t.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-sky-600" style={{ width: `${p}%` }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* What's next */}
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">מה הלאה</h2>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardLink to="/review" className="!p-4 text-center">
          <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
            <IconRotate size={20} />
          </span>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{dueCount}</div>
          <div className="text-base text-slate-600 dark:text-slate-300">לחזרה חכמה</div>
        </CardLink>
        <CardLink to="/mistakes" className="!p-4 text-center">
          <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <IconPencil size={20} />
          </span>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{progress.mistakes.length}</div>
          <div className="text-base text-slate-600 dark:text-slate-300">טעויות לתרגל</div>
        </CardLink>
        <Card className="!p-4 text-center">
          <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300">
            <IconTarget size={20} />
          </span>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {daily}/{DAILY_GOAL}
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300">יעד יומי</div>
        </Card>
      </div>

      {/* Sign collection */}
      <CardLink to="/collection" className="mb-6 block">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-200">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
              <IconSigns size={20} />
            </span>
            אוסף התמרורים
          </span>
          <span className="flex items-center gap-1 text-base text-slate-500 dark:text-slate-400">
            {signsCollected}/{signs.length} <IconArrowLeft size={16} />
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${signs.length ? (signsCollected / signs.length) * 100 : 0}%` }}
          />
        </div>
      </CardLink>

      {/* Rewards */}
      <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">הישגים</h2>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col items-center gap-1 rounded-xl border p-4 text-center ${
              b.unlocked
                ? 'border-amber-200 bg-amber-50 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10'
                : 'border-slate-200/70 bg-slate-100 opacity-50 grayscale dark:border-slate-700 dark:bg-slate-800'
            }`}
          >
            <span className="text-4xl">{b.icon}</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
