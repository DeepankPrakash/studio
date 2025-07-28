'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/generate');
  }, [router]);

  // Show a loading indicator while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Dumbbell className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
