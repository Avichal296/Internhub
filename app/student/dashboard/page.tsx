'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import { Navbar } from '@/components/navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DashboardOverview } from '@/components/student/dashboard-overview';
import { ProfileTab } from '@/components/student/profile-tab';
import ApplicationsTab from '@/components/student/applications-tab';
import SavedTab from '@/components/student/saved-tab';
import { NotificationsTab } from '@/components/student/notifications-tab';

import { Loader2, Target, Award, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchProfileAndData = async () => {
      // Fetch Supabase profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .single();

      if (!profileData) {
        // Profile doesn't exist, redirect to login to create it
        router.push('/auth/login');
        return;
      }

      setProfile(profileData);

      // Fetch dashboard data
      const [applicationsRes, savedRes, notificationsRes, recommendedRes] = await Promise.all([
        supabase.from('applications').select('id', { count: 'exact' }).eq('user_id', user.uid),
        supabase.from('saved_internships').select('id', { count: 'exact' }).eq('user_id', user.uid),
        supabase.from('notifications').select('*').eq('user_id', user.uid).eq('read', false).order('created_at', { ascending: false }).limit(5),
        supabase.from('internships').select('*').eq('status', 'approved').limit(3)
      ]);

      const appliedCount = applicationsRes.count || 0;
      const savedCount = savedRes.count || 0;
      const latestNotifications = notificationsRes.data || [];
      const recommendedInternships = recommendedRes.data || [];

      // Calculate profile completion
      const profileFields = [profileData.full_name, profileData.email, profileData.phone, profileData.bio, profileData.education, profileData.skills?.length > 0, profileData.resume_url];
      const completedFields = profileFields.filter((field: any) => field && field !== '').length;
      const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

      setDashboardData({
        appliedCount,
        savedCount,
        latestNotifications,
        recommendedInternships,
        profileCompletion,
        completedFields,
        totalFields: profileFields.length
      });
    };

    fetchProfileAndData();
  }, [user, loading, router]);

  if (loading || !profile || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (profile.role !== 'student') {
    router.push('/auth/login');
    return null;
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-6000"></div>
      </div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Student Dashboard</h1>
          <p className="text-gray-700 text-lg">Manage your profile and track your applications</p>
        </motion.div>

        {/* Enhanced Quick Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Applications</CardTitle>
                <div className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.appliedCount}</div>
                <p className="text-xs text-gray-600">Total submitted</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Saved Jobs</CardTitle>
                <div className="p-2 rounded-full bg-green-50 hover:bg-green-100 transition-colors">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.savedCount}</div>
                <p className="text-xs text-gray-600">Bookmarked</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Profile</CardTitle>
                <div className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.profileCompletion}%</div>
                <p className="text-xs text-gray-600">Complete</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Notifications</CardTitle>
                <div className="p-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardData.latestNotifications.length}</div>
                <p className="text-xs text-gray-600">Unread</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/internships">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Browse Internships
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    Update Profile
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                    View Applications
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-white/90 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Overview</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Profile</TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Applications</TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Saved</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview
                stats={{
                  totalApplications: dashboardData.appliedCount,
                  savedInternships: dashboardData.savedCount,
                  profileCompletion: dashboardData.profileCompletion,
                }}
                profileCompletion={{
                  personal: profile.full_name && profile.email ? 100 : 50,
                  education: profile.education ? 100 : 0,
                  skills: profile.skills?.length > 0 ? 100 : 0,
                  resume: profile.resume_url ? 100 : 0,
                }}
                latestNotifications={dashboardData.latestNotifications}
              />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="applications">
              <ApplicationsTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="saved">
              <SavedTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab userId={profile.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
