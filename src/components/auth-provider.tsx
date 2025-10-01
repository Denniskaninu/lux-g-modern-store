"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isAdminRoute = pathname.startsWith('/admin');

      if (!user && isAdminRoute) {
        router.push('/login');
      }
      if (user && pathname === '/login') {
        router.push('/admin');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <Skeleton className="w-screen h-screen" />
      </div>
    )
  }
  
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute && !user) {
    return null; // Don't render admin pages if not logged in
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
