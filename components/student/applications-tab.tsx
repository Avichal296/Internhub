'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ApplicationsTabProps {
  userId: string;
}

export default function ApplicationsTab({ userId }: ApplicationsTabProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships (
            *,
            companies (
              company_name
            )
          )
        `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No applications yet</p>
          <p className="text-gray-500 mb-6">Start applying to internships to see them here</p>
          <Link href="/internships">
            <Button>Browse Internships</Button>
          </Link>
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
      {applications.map((application: any) => {
        const internship = application.internships;
        return (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{internship.title}</CardTitle>
                  <CardDescription className="text-base">
                    {internship.companies?.company_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {internship.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{internship.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{internship.duration}</span>
                </div>
                {internship.stipend_min > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>₹{internship.stipend_min.toLocaleString('en-IN')}/month</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                <Link href={`/internships/${internship.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
