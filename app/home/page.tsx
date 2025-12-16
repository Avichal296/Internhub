import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/SearchBar';
import { InternshipCard } from '@/components/InternshipCard';
import { supabase } from '@/lib/supabase';
import { Search, Briefcase, MapPin, DollarSign, Users, Star, CheckCircle } from 'lucide-react';

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


export default async function HomePage() {
  let featuredInternships;
  let categories;
  let totalUsers = 10000;
  let totalInternships = 85;
  let totalApplications = 5000;
  let successRate = 95;

  try {
    console.log('Fetching data from Supabase...');
    
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

    featuredInternships = featuredData || [];

    // Fetch categories with counts
    const { data: categoryData } = await supabase
      .from('internships')
      .select('category')
      .eq('status', 'approved');

    const categoryCounts: { [key: string]: number } = {};
    categoryData?.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      icon: getCategoryIcon(name),
      count: count.toString(),
    }));

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

    totalUsers = usersCount || 10000;
    totalInternships = internshipsCount || 85;
    totalApplications = applicationsCount || 5000;
    successRate = totalApplications > 0 ? Math.min(95, Math.round((totalApplications / (totalUsers || 1)) * 100)) : 95;

    console.log('Data fetched successfully');
  } catch (error) {
    console.log('Supabase not available, using mock data:', error);
    
    // Use mock data
    featuredInternships = [
      {
        id: '1',
        title: 'Frontend Developer Intern',
        companies: { company_name: 'TechCorp', logo_url: null },
        location: 'San Francisco, CA',
        category: 'Technology',
        stipend_min: 8000,
        stipend_max: 12000,
        description: 'Join our frontend team to build amazing user interfaces.',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Marketing Intern',
        companies: { company_name: 'Growth Co', logo_url: null },
        location: 'New York, NY',
        category: 'Marketing',
        stipend_min: 5000,
        stipend_max: 8000,
        description: 'Help us create compelling marketing campaigns.',
        created_at: '2024-01-14T10:00:00Z'
      },
      {
        id: '3',
        title: 'Data Science Intern',
        companies: { company_name: 'DataCorp', logo_url: null },
        location: 'Remote',
        category: 'Technology',
        stipend_min: 10000,
        stipend_max: 15000,
        description: 'Analyze data and build machine learning models.',
        created_at: '2024-01-13T10:00:00Z'
      }
    ];

    categories = [
      { name: 'Technology', icon: '💻', count: '25' },
      { name: 'Marketing', icon: '📈', count: '15' },
      { name: 'Finance', icon: '💰', count: '12' },
      { name: 'Design', icon: '🎨', count: '10' },
      { name: 'Operations', icon: '⚙️', count: '8' },
      { name: 'Human Resources', icon: '👥', count: '6' },
      { name: 'Sales', icon: '📊', count: '5' },
      { name: 'Content Writing', icon: '✍️', count: '4' }
    ];
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="text-3xl font-bold text-primary">
            InternMatch
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
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Dream Internship
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with top companies and kickstart your career journey. Get hands-on experience, build your network, and earn while you learn.
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-gray-600">Internships</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find internships in your preferred field and gain experience in the industry you love
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/internships?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} internships</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Internships */}
      {featuredInternships && featuredInternships.length > 0 ? (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              Featured Internships
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Discover the latest opportunities from top companies
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/internships">
                <Button size="lg" variant="outline">
                  View All Internships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              No Internships Yet
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be the first to post an internship or check back later for new opportunities
            </p>
            <Link href="/auth/signup">
              <Button size="lg">
                Join as Recruiter
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            How InternMatch Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get started in just 3 simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and build your profile with skills, education, and experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Find Internships</h3>
              <p className="text-gray-600">
                Search and apply to internships that match your interests and skills
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Hired</h3>
              <p className="text-gray-600">
                Connect with companies and start your internship journey
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect internship match
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

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
