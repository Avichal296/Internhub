import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';


interface Internship {
  id: string | number;
  title: string;
  description: string;
  location: string;
  stipend?: number;
  stipend_min?: number;
  stipend_max?: number;
  duration?: string;
  remote?: boolean;
  category: string;
  skills?: string[];
  created_at: string;
  company?: {
    company_name: string;
    logo_url?: string | null;
  };
  recruiter?: {
    id: string;
    name: string;
    company_name: string;
    company_logo?: string;
  };
}

interface InternshipCardProps {
  internship: Internship;
}


export function InternshipCard({ internship }: InternshipCardProps) {
  // Handle different data structures
  const companyName = internship.company?.company_name || internship.recruiter?.company_name || 'Company';
  const companyLogo = internship.company?.logo_url || internship.recruiter?.company_logo;
  const stipend = internship.stipend || ((internship.stipend_min || 0) + (internship.stipend_max || 0)) / 2;

  const formatStipend = (amount: number) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount}`;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1 line-clamp-1">
              {internship.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {companyName}
            </CardDescription>
          </div>
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {internship.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{internship.location}</span>
            {internship.remote && (
              <Badge variant="secondary" className="text-xs">
                Remote
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>{formatStipend(stipend)}/month</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{internship.duration || 'Duration not specified'}</span>
          </div>
        </div>

        {internship.skills && internship.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {internship.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {internship.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{internship.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {timeAgo(internship.created_at)}
          </span>
          <Link href={`/internships/${internship.id}`}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
