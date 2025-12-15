'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFirebaseUser } from '@/hooks/use-firebase-user';
import { signOut } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export function Navbar() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    await fetch('/api/auth/logout', { method: 'POST' });
    toast({
      title: 'Logged out successfully',
    });
    router.push('/home');
  };

  if (!mounted) {
    return (
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold text-primary">
            InternMatch
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/home" className="text-2xl font-bold text-primary">
          InternMatch
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/internships">
            <Button variant="ghost">Internships</Button>
          </Link>

          {loading ? (
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/student/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
