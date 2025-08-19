
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Home, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserMenu from '@/components/UserMenu';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = (
    <>
      <Link
        href="/app/generate"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/app/generate'
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <Home className="h-4 w-4" />
        Generate Plan
      </Link>
      <Link
        href="/app/chat"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/app/chat'
            ? 'bg-white/20 text-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <MessageSquare className="h-4 w-4" />
        Chat with AI
      </Link>
    </>
  );

  return (
    <ProtectedRoute>
      <div className="app-background min-h-screen">
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-black/20 backdrop-blur-sm md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6 justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-white">
                  <Dumbbell className="h-6 w-6 text-blue-400" />
                  <span className="gradient-text">FITMATE</span>
                </Link>
                <div className="hidden md:block">
                  <UserMenu />
                </div>
              </div>
              <nav className="flex-1 grid items-start px-2 text-sm font-medium lg:px-4">
                 {navItems}
              </nav>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b border-white/10 bg-black/20 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-black/80 backdrop-blur-sm border-white/20">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold mb-4 text-white"
                    >
                      <Dumbbell className="h-6 w-6 text-blue-400" />
                      <span className="gradient-text">FITMATE</span>
                    </Link>
                    {navItems}
                  </nav>
                </SheetContent>
              </Sheet>
               <div className="w-full flex-1">
                {/* Can add search or other header items here */}
              </div>
              <UserMenu />
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
