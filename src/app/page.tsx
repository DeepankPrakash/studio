
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
    <div className="main-background flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Dumbbell className="h-16 w-16 animate-spin text-white mx-auto" />
        <h1 className="text-4xl font-bold gradient-text">FITMATE</h1>
        <p className="text-white/80">Your AI-Powered Fitness Companion</p>
      </div>
    </div>
  );
}
