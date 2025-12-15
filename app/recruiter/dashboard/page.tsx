'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import { Navbar } from '@/components/navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CompanyProfileTab } from '@/components/recruiter/company-profile-tab';
import { PostInternshipTab } from '@/components/recruiter/post-internship-tab';
import { ManageInternshipsTab } from '@/components/recruiter/manage-internships-tab';
import { ApplicantsTab } from '@/components/recruiter/applicants-tab';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const [firebaseUser, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If not logged in → redirect to login
    if (!firebaseUser) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      // Fetch recruiter profile from Supabase using Firebase UID
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', firebaseUser.uid)
        .single();

      if (error || !data) {
        router.push('/auth/login');
        return;
      }

      // Check if user is recruiter
      if (data.role !== 'recruiter') {
        router.push('/auth/login');
        return;
      }

      setProfile(data);
    };

    fetchProfile();
  }, [firebaseUser, loading, router]);

  // Loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Recruiter Dashboard</h1>
          <p className="text-gray-700 text-lg">Manage your company and internship postings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="company" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-white/90 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="company" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Company Profile</TabsTrigger>
              <TabsTrigger value="post" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Post Internship</TabsTrigger>
              <TabsTrigger value="manage" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Manage Posts</TabsTrigger>
              <TabsTrigger value="applicants" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white transition-all duration-300">Applicants</TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <CompanyProfileTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="post">
              <PostInternshipTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="manage">
              <ManageInternshipsTab userId={profile.id} />
            </TabsContent>

            <TabsContent value="applicants">
              <ApplicantsTab userId={profile.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
