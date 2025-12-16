'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("LOGIN STARTED");
      
      const { user, error } = await signIn(email, password);

      if (error) {
        console.log("Firebase login error:", error);
        toast({
          title: 'Login failed',
          description: error,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Firebase login successful:", user.uid);
        const token = await user.getIdToken();

        console.log("Setting session cookies...");

        // Set session cookie - critical for auth flow
        const sessionResponse = await fetch('/api/session/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!sessionResponse.ok) {
          console.log("Session setting failed, but continuing...");
        } else {
          console.log("Session cookies set successfully");
        }

        // Try to get or create user profile, but don't fail if Supabase is not available
        let userProfile = null;
        try {
          const profileResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.uid,
              email: user.email,
              fullName: user.displayName || user.email?.split('@')[0] || 'User',
              role: 'student', // Default role for existing users
              token
            }),
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            userProfile = profileData.user;
            console.log("User profile retrieved/created:", userProfile);
          } else {
            console.log("Profile creation/retrieval failed, using defaults");
          }
        } catch (profileError) {
          console.log("Profile API not available, using defaults:", profileError);
        }

        // Determine role and route
        const role = userProfile?.role || 'student'; // Default to student if no profile

        console.log("User role:", role);

        // Navigate based on role
        if (role === 'student') {
          router.push('/student/dashboard');
        } else if (role === 'recruiter') {
          router.push('/recruiter/dashboard');
        } else if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <motion.div
        className="absolute top-4 left-4 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/home">
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-gray-900">Welcome back</CardTitle>
              <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Log in'
                    )}
                  </Button>
                </motion.div>
              </form>
              <motion.div
                className="mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign up
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
