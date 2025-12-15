import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface RecentApplicationsProps {
  applications: any[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No applications yet</p>
            <p className="text-sm text-gray-500 mb-4">Start applying to internships to see them here</p>
            <Link href="/internships">
              <Button size="sm">Browse Internships</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 3).map((application: any) => {
              const internship = application.internships;
              return (
                <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{internship.title}</h4>
                      <p className="text-xs text-gray-600">{internship.companies?.company_name}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    {internship.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{internship.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{internship.duration}</span>
                    </div>
                    {internship.stipend_min > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>₹{internship.stipend_min.toLocaleString('en-IN')}/month</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Applied {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                    <Link href={`/internships/${internship.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {applications.length > 3 && (
              <div className="text-center pt-2">
                <Link href="/student/dashboard?tab=applications">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    View All Applications ({applications.length})
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
