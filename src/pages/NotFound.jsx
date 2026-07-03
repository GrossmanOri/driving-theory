import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconCar, IconHome } from '../components/Icons';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4">
      <Card className="w-full text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
          <IconCar size={36} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          אופס! הדף הזה לא קיים 🚗💨
        </h1>
        <p className="mb-6 text-lg text-slate-500">אולי חזרנו לכביש הראשי?</p>
        <Button to="/" size="lg">
          <IconHome size={22} />
          חזרה לבית
        </Button>
      </Card>
    </div>
  );
}
