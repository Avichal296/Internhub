'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SavedTabProps {
  userId: string;
}

export default function SavedTab({ userId }: SavedTabProps) {
  const [savedInternships, setSavedInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedInternships = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_internships')
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
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved internships:', error);
      } else {
        setSavedInternships(data || []);
      }
      setLoading(false);
    };

    fetchSavedInternships();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!savedInternships || savedInternships.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No saved internships</p>
          <p className="text-gray-500 mb-6">Save internships to review them later</p>
          <Link href="/internships">
            <Button>Browse Internships</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedInternships.map((saved: any) => {
        const internship = saved.internships;
        return (
          <Card key={saved.internship_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{internship.title}</CardTitle>
                  <CardDescription className="text-base">
                    {internship.companies?.company_name}
                  </CardDescription>
                </div>
                {internship.is_wfh && (
                  <Badge variant="secondary">Work From Home</Badge>
                )}
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
                    <span>
                      ₹{internship.stipend_min.toLocaleString('en-IN')}
                      {internship.stipend_max > internship.stipend_min &&
                        ` - ₹${internship.stipend_max.toLocaleString('en-IN')}`
                      }/month
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Saved {new Date(saved.saved_at).toLocaleDateString()}
                </span>
                <Link href={`/internships/${internship.id}`}>
                  <Button size="sm">View & Apply</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
