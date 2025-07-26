'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dumbbell, Home, LogOut, MessageSquare, User } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Dumbbell className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">FitGenie</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/app/generate'}
                tooltip={{ children: 'Generate Plan' }}
              >
                <Link href="/app/generate">
                  <Home />
                  <span>Generate Plan</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/app/chat'}
                tooltip={{ children: 'Chat with AI' }}
              >
                <Link href="/app/chat">
                  <MessageSquare />
                  <span>Chat with AI</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                <User className="w-5 h-5"/>
                <span className="text-sm truncate">{user.email}</span>
            </div>
           <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
             <LogOut className="mr-2"/>
             Sign Out
           </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </SidebarProvider>
  );
}
