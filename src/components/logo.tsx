import { Gem } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Gem className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold uppercase tracking-wider text-foreground">
        LUX
      </span>
    </div>
  );
}
