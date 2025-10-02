
"use client";

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="relative flex min-h-dvh flex-col">
      {!isAdminRoute && <SiteHeader />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <SiteFooter />}
    </div>
  );
}
