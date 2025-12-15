import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';

interface ApplicantsTabProps {
  userId: string;
}

export function ApplicantsTab({ userId }: ApplicantsTabProps) {
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('recruiter_id', userId)
      .single();

    if (!company) {
      setHasCompany(false);
      setLoading(false);
      return;
    }

    setHasCompany(true);

    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        internships!inner (
          title,
          company_id
        ),
        users (
          full_name,
          email,
          phone,
          skills,
          resume_url
        )
      `)
      .eq('internships.company_id', company.id)
      .order('applied_at', { ascending: false });

    setApplications(apps || []);
    setLoading(false);
  };

  const handleStatusUpdate = async (applicationId: number, status: 'selected' | 'rejected') => {
    setUpdatingStatus(applicationId);
    try {
      // First, check if the recruiter owns the internship
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      const { data: internship, error: internshipError } = await supabaseAdmin
        .from('internships')
        .select('company_id')
        .eq('id', application.internship_id)
        .single();

      if (internshipError) throw internshipError;

      const { data: company, error: companyError } = await supabaseAdmin
        .from('companies')
        .select('recruiter_id')
        .eq('id', internship.company_id)
        .single();

      if (companyError || company?.recruiter_id !== userId) {
        throw new Error('Unauthorized: You do not own this internship');
      }

      const { error } = await supabaseAdmin
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );

      // Create notification for student
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: application.user_id,
          title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your application for ${application.internships.title} has been ${status}.`,
          type: status === 'selected' ? 'success' : 'warning',
        });

      toast({
        title: 'Success',
        description: `Application ${status} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update application status.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (!hasCompany) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-xl text-gray-600">Create a company profile first</p>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No applications yet</p>
          <p className="text-gray-500">Applications will appear here once students start applying</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((application: any) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{application.users?.full_name}</CardTitle>
                <CardDescription>
                  Applied for: {application.internships?.title}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm mb-4">
              <div>
                <span className="font-semibold">Email:</span> {application.users?.email}
              </div>
              {application.users?.phone && (
                <div>
                  <span className="font-semibold">Phone:</span> {application.users.phone}
                </div>
              )}
              {application.users?.skills && application.users.skills.length > 0 && (
                <div>
                  <span className="font-semibold">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.users.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
              <div className="flex gap-2">
                {application.users?.resume_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={application.users.resume_url} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </Button>
                )}
                {application.status === 'applied' && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleStatusUpdate(application.id, 'selected')}
                      disabled={updatingStatus === application.id}
                    >
                      {updatingStatus === application.id ? 'Updating...' : 'Select'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      disabled={updatingStatus === application.id}
                    >
                      {updatingStatus === application.id ? 'Updating...' : 'Reject'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
