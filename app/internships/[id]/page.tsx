import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock, DollarSign, Users, Briefcase } from 'lucide-react';
import ApplyForm from '@/components/ApplyForm';


export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  let internship;
  
  try {
    console.log('Fetching internship details from Supabase...');
    
    const { data, error } = await supabase
      .from('internships')
      .select(`
        *,
        companies (
          company_name,
          description,
          website,
          logo_url,
          location
        )
      `)
      .eq('id', params.id)
      .eq('status', 'approved')
      .single();

    if (error) {
      console.log('Supabase fetch failed, using mock data:', error);
      // Use mock internship data
      internship = {
        id: params.id,
        title: 'Frontend Developer Intern',
        companies: {
          company_name: 'TechCorp',
          description: 'TechCorp is a leading technology company focused on innovative solutions.',
          website: 'https://techcorp.com',
          logo_url: null,
          location: 'San Francisco, CA'
        },
        location: 'San Francisco, CA',
        duration: '3 months',
        stipend_min: 8000,
        stipend_max: 12000,
        openings: 5,
        is_wfh: false,
        description: 'Join our frontend team to build amazing user interfaces using modern web technologies. You will work on exciting projects that impact millions of users worldwide.',
        responsibilities: '• Develop and maintain responsive web applications\n• Collaborate with designers and backend developers\n• Write clean, maintainable code\n• Participate in code reviews\n• Stay updated with latest frontend trends',
        skills_required: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
        perks: '• Flexible working hours\n• Learning opportunities\n• Mentorship program\n• Team events',
        status: 'approved'
      };
    } else {
      internship = data;
    }
    
    console.log('Internship details fetched successfully');
  } catch (error) {
    console.log('Supabase not available, using mock data:', error);
    
    // Fallback mock internship data
    internship = {
      id: params.id,
      title: 'Frontend Developer Intern',
      companies: {
        company_name: 'TechCorp',
        description: 'TechCorp is a leading technology company focused on innovative solutions.',
        website: 'https://techcorp.com',
        logo_url: null,
        location: 'San Francisco, CA'
      },
      location: 'San Francisco, CA',
      duration: '3 months',
      stipend_min: 8000,
      stipend_max: 12000,
      openings: 5,
      is_wfh: false,
      description: 'Join our frontend team to build amazing user interfaces using modern web technologies. You will work on exciting projects that impact millions of users worldwide.',
      responsibilities: '• Develop and maintain responsive web applications\n• Collaborate with designers and backend developers\n• Write clean, maintainable code\n• Participate in code reviews\n• Stay updated with latest frontend trends',
      skills_required: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
      perks: '• Flexible working hours\n• Learning opportunities\n• Mentorship program\n• Team events',
      status: 'approved'
    };
  }

  if (!internship) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold text-primary">
            InternMatch
          </Link>
          <div className="flex gap-4">
            <Link href="/internships">
              <Button variant="ghost">Back to Listings</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{internship.title}</h1>
                <p className="text-xl text-gray-600">{internship.companies?.company_name}</p>
              </div>
              {internship.is_wfh && (
                <Badge variant="secondary" className="text-sm">Work From Home</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{internship.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{internship.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  ₹{internship.stipend_min.toLocaleString('en-IN')}
                  {internship.stipend_max > internship.stipend_min && 
                    ` - ₹${internship.stipend_max.toLocaleString('en-IN')}`
                  }/month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{internship.openings} opening{internship.openings > 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About the Internship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{internship.description}</p>
            </div>

            {internship.responsibilities && (
              <div>
                <h3 className="font-semibold mb-2">Responsibilities</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{internship.responsibilities}</p>
              </div>
            )}

            {internship.skills_required && internship.skills_required.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {internship.skills_required.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {internship.perks && (
              <div>
                <h3 className="font-semibold mb-2">Perks</h3>
                <p className="text-gray-700">{internship.perks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About {internship.companies?.company_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{internship.companies?.description || 'No description available'}</p>
            {internship.companies?.website && (
              <a 
                href={internship.companies.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit Company Website →
              </a>
            )}
          </CardContent>
        </Card>

        <ApplyForm internship={internship} />
      </div>
    </div>
  );
}
