'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseUser } from '@/hooks/use-firebase-user';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Question {
  question: string;
  type?: string; // assuming 'text' for now
}

interface Internship {
  id: number;
  questions: Question[];
  title: string;
}

interface ApplyFormProps {
  internship: Internship;
}

export default function ApplyForm({ internship }: ApplyFormProps) {
  const { user, loading } = useFirebaseUser();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [coverLetter, setCoverLetter] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfApplied();
    }
  }, [user, internship.id]);

  const checkIfApplied = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('internship_id', internship.id)
      .eq('user_id', user.uid)
      .single();

    if (data) {
      setAlreadyApplied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('applications')
      .insert({
        internship_id: internship.id,
        user_id: user.uid,
        answers: answers,
        cover_letter: coverLetter,
      });

    setSubmitting(false);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } else {
      // Create notification for recruiter
      const { data: internshipData } = await supabase
        .from('internships')
        .select('company_id, companies(recruiter_id)')
        .eq('id', internship.id)
        .single();

      if (internshipData?.companies?.recruiter_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: internshipData.companies.recruiter_id,
            title: 'New Application Received',
            message: `A student has applied for ${internship.title}`,
            type: 'info',
          });
      }

      toast({
        title: 'Success',
        description: 'Your application has been submitted!',
      });
      setAlreadyApplied(true);
      // Redirect to applications page
      window.location.href = '/student/dashboard';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Apply for this Internship</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You need to be logged in to apply.</p>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alreadyApplied) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have already applied for this internship.</p>
          <Link href="/student/dashboard">
            <Button className="mt-4">View My Applications</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Apply for {internship.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {internship.questions && internship.questions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Application Questions</h3>
              {internship.questions.map((q, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {q.question}
                  </label>
                  <Textarea
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                    placeholder="Your answer..."
                    required
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us why you're interested..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
