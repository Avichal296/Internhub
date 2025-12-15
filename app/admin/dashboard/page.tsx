'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabaseAdmin } from '@/lib/supabase';
import { Users, Briefcase, FileText, TrendingUp, CheckCircle, XCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [pendingInternships, setPendingInternships] = useState<any[]>([]);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [internshipStats, setInternshipStats] = useState<any[]>([]);
  const [applicationStats, setApplicationStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = '/auth/login';
      return;
    }

    // Get pending internships
    const { data: pendingInternshipsData } = await supabaseAdmin
      .from('internships')
      .select(`
        *,
        companies (
          company_name,
          recruiter_id,
          users (
            full_name,
            email
          )
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    // Get pending companies
    const { data: pendingCompaniesData } = await supabaseAdmin
      .from('companies')
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .eq('approved', false)
      .order('created_at', { ascending: false });

    // Get analytics
    const { data: userStatsData } = await supabaseAdmin
      .from('users')
      .select('role, created_at');

    const { data: internshipStatsData } = await supabaseAdmin
      .from('internships')
      .select('status, created_at');

    const { data: applicationStatsData } = await supabaseAdmin
      .from('applications')
      .select('created_at');

    setPendingInternships(pendingInternshipsData || []);
    setPendingCompanies(pendingCompaniesData || []);
    setUserStats(userStatsData || []);
    setInternshipStats(internshipStatsData || []);
    setApplicationStats(applicationStatsData || []);
    setLoading(false);
  };
  // Calculate analytics
  const totalUsers = userStats?.length || 0;
  const totalStudents = userStats?.filter(u => u.role === 'student').length || 0;
  const totalRecruiters = userStats?.filter(u => u.role === 'recruiter').length || 0;
  const totalAdmins = userStats?.filter(u => u.role === 'admin').length || 0;

  const totalInternships = internshipStats?.length || 0;
  const approvedInternships = internshipStats?.filter(i => i.status === 'approved').length || 0;
  const pendingInternshipCount = internshipStats?.filter(i => i.status === 'pending').length || 0;

  const totalApplications = applicationStats?.length || 0;

  // Daily signups (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSignups = userStats?.filter(u => new Date(u.created_at) > sevenDaysAgo).length || 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleInternshipAction = async (internshipId: number, action: 'approve' | 'reject') => {
    const status = action === 'approve' ? 'approved' : 'rejected';
    const { error } = await supabaseAdmin
      .from('internships')
      .update({ status })
      .eq('id', internshipId);

    if (error) {
      console.error('Error updating internship:', error);
    } else {
      // Refresh data
      fetchData();
    }
  };

  const handleCompanyApproval = async (companyId: number, approve: boolean) => {
    const { error } = await supabaseAdmin
      .from('companies')
      .update({ approved: approve })
      .eq('id', companyId);

    if (error) {
      console.error('Error updating company:', error);
    } else {
      // Refresh data
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the InternMatch platform</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalStudents} students, {totalRecruiters} recruiters, {totalAdmins} admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInternships}</div>
              <p className="text-xs text-muted-foreground">
                {approvedInternships} approved, {pendingInternshipCount} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Applications submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSignups}</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="pending-internships">Pending Internships</TabsTrigger>
            <TabsTrigger value="pending-companies">Pending Companies</TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="internships">All Internships</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Platform Growth
                  </CardTitle>
                  <CardDescription>Monthly user and internship trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', users: 100, internships: 20 },
                      { month: 'Feb', users: 150, internships: 35 },
                      { month: 'Mar', users: 200, internships: 50 },
                      { month: 'Apr', users: 280, internships: 70 },
                      { month: 'May', users: totalUsers, internships: totalInternships }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="internships" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Approval Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {totalInternships > 0 ? Math.round((approvedInternships / totalInternships) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Applications per Internship</span>
                    <span className="text-lg font-bold text-blue-600">
                      {totalInternships > 0 ? Math.round(totalApplications / totalInternships) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Users (7 days)</span>
                    <span className="text-lg font-bold text-purple-600">{recentSignups}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Approvals</span>
                    <span className="text-lg font-bold text-orange-600">
                      {pendingInternshipCount + pendingCompanies.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending-internships">
            <Card>
              <CardHeader>
                <CardTitle>Pending Internship Approvals</CardTitle>
                <CardDescription>Review and approve internship postings</CardDescription>
              </CardHeader>
              <CardContent>
                {!pendingInternships || pendingInternships.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No pending internships</p>
                ) : (
                  <div className="space-y-4">
                    {pendingInternships.map((internship: any) => (
                      <Card key={internship.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{internship.title}</CardTitle>
                              <CardDescription>
                                {internship.companies?.company_name} • {internship.companies?.users?.full_name}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{internship.description}</p>
                          <div className="flex gap-2">
                            <form action={handleInternshipAction.bind(null, internship.id, 'approve')}>
                              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </form>
                            <form action={handleInternshipAction.bind(null, internship.id, 'reject')}>
                              <Button type="submit" size="sm" variant="destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-companies">
            <Card>
              <CardHeader>
                <CardTitle>Pending Company Approvals</CardTitle>
                <CardDescription>Approve recruiter companies</CardDescription>
              </CardHeader>
              <CardContent>
                {!pendingCompanies || pendingCompanies.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No pending companies</p>
                ) : (
                  <div className="space-y-4">
                    {pendingCompanies.map((company: any) => (
                      <Card key={company.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{company.company_name}</CardTitle>
                          <CardDescription>{company.users?.full_name} • {company.users?.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{company.description}</p>
                          <div className="flex gap-2">
                            <form action={handleCompanyApproval.bind(null, company.id, true)}>
                              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </form>
                            <form action={handleCompanyApproval.bind(null, company.id, false)}>
                              <Button type="submit" size="sm" variant="destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats?.map((user: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships">
            <Card>
              <CardHeader>
                <CardTitle>All Internships</CardTitle>
                <CardDescription>View all internship postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {internshipStats?.map((internship: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Internship #{internship.id}</p>
                            <p className="text-sm text-gray-500">Created {new Date(internship.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={internship.status === 'approved' ? 'default' : 'secondary'}>
                            {internship.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
