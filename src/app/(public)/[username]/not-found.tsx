import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <p className="text-6xl font-black tracking-tighter">404</p>
      <p className="text-lg text-muted-foreground">This profile does not exist.</p>
      <Button asChild variant="outline" className="rounded-full px-8">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
