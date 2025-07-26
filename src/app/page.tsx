'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Dumbbell } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is false to avoid race conditions
    if (!loading) {
      if (user) {
        router.replace('/app/generate');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show a loading indicator while checking auth state
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Dumbbell className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
