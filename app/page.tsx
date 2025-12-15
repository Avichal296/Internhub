'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/SearchBar';
import { InternshipCard } from '@/components/InternshipCard';
import { supabase } from '@/lib/supabase';
import { Search, Briefcase, MapPin, DollarSign, Users, Star, CheckCircle, Award, Target, Zap, Quote, ChevronDown, ChevronUp, Mail, Phone, MapPin as MapPinIcon, HelpCircle, Info, MessageCircle, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';

function getCategoryIcon(category: string) {
  const icons: { [key: string]: string } = {
    Technology: '💻',
    Marketing: '📈',
    Finance: '💰',
    Design: '🎨',
    Operations: '⚙️',
    'Human Resources': '👥',
    Sales: '📊',
    'Content Writing': '✍️',
  };
  return icons[category] || '💼';
}

export default function HomePage() {
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInternships: 0,
    totalApplications: 0,
    successRate: 95
  });
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured internships (latest approved ones)
        const { data: featuredData } = await supabase
          .from('internships')
          .select(`
            *,
            companies (
              company_name,
              logo_url
            )
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6);

        setFeaturedInternships(featuredData as any[] || []);

        // Fetch categories with counts
        const { data: categoryData } = await supabase
          .from('internships')
          .select('category')
          .eq('status', 'approved');

        const categoryCounts: { [key: string]: number } = {};
        categoryData?.forEach(item => {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });

        const categoriesArray = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          icon: getCategoryIcon(name),
          count: count.toString(),
        }));

        setCategories(categoriesArray as any[]);

        // Fetch stats
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const { count: internshipsCount } = await supabase
          .from('internships')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { count: applicationsCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true });

        const totalUsers = usersCount || 0;
        const totalInternships = internshipsCount || 0;
        const totalApplications = applicationsCount || 0;
        const successRate = totalApplications > 0 ? Math.min(95, Math.round((totalApplications / (totalUsers || 1)) * 100)) : 95;

        setStats({
          totalUsers,
          totalInternships,
          totalApplications,
          successRate
        });
      } catch (error) {
        console.log('Supabase not configured, showing default values');
        setStats({
          totalUsers: 10000,
          totalInternships: 500,
          totalApplications: 5000,
          successRate: 95
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const faqs = [
    {
      question: "How does InternMatch work?",
      answer: "InternMatch connects students with companies through our AI-powered matching system. Students create profiles, companies post internships, and our platform matches the best candidates automatically."
    },
    {
      question: "Is InternMatch free for students?",
      answer: "Yes! InternMatch is completely free for students. You can create a profile, search internships, apply to positions, and track your applications at no cost."
    },
    {
      question: "How do companies post internships?",
      answer: "Companies can sign up for a recruiter account and post internships through our dashboard. We offer various pricing plans based on the number of postings and features needed."
    },
    {
      question: "Can I apply to multiple internships?",
      answer: "Absolutely! You can apply to as many internships as you'd like. Our platform makes it easy to track all your applications and their status in one place."
    },
    {
      question: "How long does the application process take?",
      answer: "The application process is quick - usually just a few minutes per internship. Companies typically respond within 1-2 weeks, though this can vary."
    }
  ];

  const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index as any);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
      </div>

      {/* Header */}
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-3xl font-bold text-primary">InternMatch</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/internships" className="text-gray-600 hover:text-primary">
              Internships
            </Link>
            <Link href="/companies" className="text-gray-600 hover:text-primary">
              Companies
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="relative z-10 py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find Your Dream Internship
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Connect with top companies and kickstart your career journey. Get hands-on experience, build your network, and earn while you learn.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <SearchBar />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm py-16 border-b shadow-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center mb-8 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Real-Time Platform Statistics
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm"
            >
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
              <div className="text-gray-700 font-medium">Active Students</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm"
            >
              <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalInternships}</div>
              <div className="text-gray-700 font-medium">Live Internships</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm"
            >
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalApplications}</div>
              <div className="text-gray-700 font-medium">Applications Submitted</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm"
            >
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.successRate}%</div>
              <div className="text-gray-700 font-medium">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <motion.div
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Explore by Category
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Find internships in your preferred field and gain experience in the industry you love
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/internships?category=${category.name}`}>
                    <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-4">{category.icon}</div>
                        <h3 className="font-bold mb-2 text-gray-800">{category.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{category.count} internships</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Featured Internships */}
      {featuredInternships.length > 0 ? (
        <motion.div
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-4"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Featured Internships
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Discover the latest opportunities from top companies
            </motion.p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredInternships.map((internship: any, index: number) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <InternshipCard internship={internship} />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/internships">
                <Button size="lg" variant="outline">
                  View All Internships
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              No Internships Yet
            </motion.h2>
            <motion.p
              className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Be the first to post an internship or check back later for new opportunities
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/auth/signup">
                <Button size="lg">
                  Join as Recruiter
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      <motion.div
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-4"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose InternMatch?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover the features that make InternMatch the perfect platform for your internship journey
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
              <p className="text-gray-700">
                Our AI-powered algorithm matches you with internships that fit your skills and interests perfectly.
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Application</h3>
              <p className="text-gray-700">
                Apply to multiple internships with one-click applications and track your progress in real-time.
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Companies</h3>
              <p className="text-gray-700">
                All internships are posted by verified companies, ensuring quality opportunities for students.
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Support</h3>
              <p className="text-gray-700">
                Join a thriving community of students and professionals sharing insights and opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-4"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Hear from students and companies who have found success through InternMatch
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6">
                <CardContent className="text-center">
                  <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    "InternMatch helped me land my dream internship at Google. The platform is intuitive and the matching algorithm is spot on!"
                  </p>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Software Engineering Intern at Google</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="p-6">
                <CardContent className="text-center">
                  <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    "As a recruiter, InternMatch has made it so much easier to find qualified candidates. The quality of applicants is excellent."
                  </p>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-600">HR Manager at Microsoft</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6">
                <CardContent className="text-center">
                  <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-4">
                    "The application process was seamless, and I received responses within days. Highly recommend InternMatch to all students!"
                  </p>
                  <div className="font-semibold">Emily Davis</div>
                  <div className="text-sm text-gray-600">Marketing Intern at Adobe</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-4"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How InternMatch Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Get started in just 3 simple steps
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Create Your Profile</h3>
              <p className="text-gray-700">
                Sign up and build your profile with skills, education, and experience
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Find Internships</h3>
              <p className="text-gray-700">
                Search and apply to internships that match your interests and skills
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Hired</h3>
              <p className="text-gray-700">
                Connect with companies and start your internship journey
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-4"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 text-center mb-12 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything you need to know about getting started with InternMatch
          </motion.p>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  )}
                </button>
                {expandedFaq === index && (
                  <motion.div
                    className="px-6 pb-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="bg-blue-600 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of students who have found their perfect internship match
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InternMatch</h3>
              <p className="text-gray-400">
                Connecting students with their dream internships since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/internships" className="hover:text-white">Find Internships</Link></li>
                <li><Link href="/companies" className="hover:text-white">Browse Companies</Link></li>
                <li><Link href="/student/dashboard" className="hover:text-white">My Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/recruiter/dashboard" className="hover:text-white">Post Internship</Link></li>
                <li><Link href="/recruiter/dashboard" className="hover:text-white">Manage Applications</Link></li>
                <li><Link href="/companies" className="hover:text-white">Company Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InternMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
