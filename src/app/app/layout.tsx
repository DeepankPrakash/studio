'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dumbbell, Home, MessageSquare, Menu, LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAction();
    router.push('/login');
    setLoggingOut(false);
  };

  const navItems = (
    <>
      <Link
        href="/app/generate"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/app/generate'
            ? 'bg-muted text-primary'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <Home className="h-4 w-4" />
        Generate Plan
      </Link>
      <Link
        href="/app/chat"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname === '/app/chat'
            ? 'bg-muted text-primary'
            : 'text-muted-foreground hover:text-primary'
        }`}
      >
        <MessageSquare className="h-4 w-4" />
        Chat with AI
      </Link>
    </>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="">FITMATE</span>
            </Link>
          </div>
          <nav className="flex-1 grid items-start px-2 text-sm font-medium lg:px-4">
             {navItems}
          </nav>
          <div className="mt-auto p-4">
             <Button variant="ghost" className="w-full justify-start" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <span>FITMATE</span>
                </Link>
                {navItems}
              </nav>
               <div className="mt-auto">
                <Button variant="ghost" className="w-full justify-start text-lg" onClick={handleLogout} disabled={loggingOut}>
                    {loggingOut ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <LogOut className="mr-2 h-5 w-5" />}
                    Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
           <div className="w-full flex-1">
            {/* Can add search or other header items here */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
