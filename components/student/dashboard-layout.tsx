'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText,
  Bookmark,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface StudentDashboardLayoutProps {
  user: any;
  children: React.ReactNode;
}

export function StudentDashboardLayout({ user, children }: StudentDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home, current: pathname === '/student/dashboard' },
    { name: 'Applications', href: '/student/dashboard?tab=applications', icon: FileText, current: pathname === '/student/dashboard' && new URLSearchParams(window.location.search).get('tab') === 'applications' },
    { name: 'Saved', href: '/student/dashboard?tab=saved', icon: Bookmark, current: pathname === '/student/dashboard' && new URLSearchParams(window.location.search).get('tab') === 'saved' },
    { name: 'Profile', href: '/student/dashboard?tab=profile', icon: User, current: pathname === '/student/dashboard' && new URLSearchParams(window.location.search).get('tab') === 'profile' },
    { name: 'Notifications', href: '/student/dashboard?tab=notifications', icon: Bell, current: pathname === '/student/dashboard' && new URLSearchParams(window.location.search).get('tab') === 'notifications' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Link href="/home" className="text-2xl font-bold text-primary">
              InternMatch
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>
                  {user.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/internships">
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Internships
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
