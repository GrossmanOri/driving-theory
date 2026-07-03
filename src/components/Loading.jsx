import { IconCar } from './Icons';

export function LoadingScreen({ label = 'טוענים…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="animate-drive text-sky-500">
        <IconCar size={56} />
      </div>
      <div className="animate-shimmer h-2 w-40 rounded-full" />
      <p className="text-lg text-slate-500">{label}</p>
    </div>
  );
}
