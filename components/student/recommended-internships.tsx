'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, BookmarkPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface RecommendedInternshipsProps {
  userId: string;
}

export function RecommendedInternships({ userId }: RecommendedInternshipsProps) {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedInternships();
  }, [userId]);

  const fetchRecommendedInternships = async () => {
    try {
      // Get user's skills and applied internships to make recommendations
      const { data: userData } = await supabase
        .from('users')
        .select('skills')
        .eq('id', userId)
        .single();

      const userSkills = userData?.skills || [];

      // Get internships that match user's skills or are popular
      let query = supabase
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
        .limit(5);

      // If user has skills, prioritize internships that match
      if (userSkills.length > 0) {
        query = query.contains('skills_required', userSkills);
      }

      const { data } = await query;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching recommended internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInternship = async (internshipId: string) => {
    try {
      const { error } = await supabase
        .from('saved_internships')
        .insert({
          user_id: userId,
          internship_id: internshipId,
        });

      if (!error) {
        // Update UI to show saved state
        setInternships(prev =>
          prev.map(internship =>
            internship.id === internshipId
              ? { ...internship, isSaved: true }
              : internship
          )
        );
      }
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No recommendations yet</p>
            <p className="text-sm text-gray-500 mb-4">Complete your profile to get personalized recommendations</p>
            <Link href="/student/dashboard?tab=profile">
              <Button size="sm">Complete Profile</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <div key={internship.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{internship.title}</h4>
                    <p className="text-xs text-gray-600">{internship.companies?.company_name}</p>
                  </div>
                  <div className="flex gap-1">
                    {internship.is_wfh && (
                      <Badge variant="secondary" className="text-xs">WFH</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveInternship(internship.id)}
                      disabled={internship.isSaved}
                      className="p-1 h-6 w-6"
                    >
                      <BookmarkPlus className="h-3 w-3" />
                    </Button>
                  </div>
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

                <Link href={`/internships/${internship.id}`}>
                  <Button size="sm" className="w-full text-xs">
                    View & Apply
                  </Button>
                </Link>
              </div>
            ))}

            <div className="text-center pt-2">
              <Link href="/internships">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                  Browse All Internships
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
