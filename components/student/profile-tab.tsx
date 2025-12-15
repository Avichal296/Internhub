'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, X, Upload } from 'lucide-react';

interface ProfileTabProps {
  userId: string;
}

export function ProfileTab({ userId }: ProfileTabProps) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) {
        setUser(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setBio(data.bio || '');
        setSkills(data.skills || []);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Error',
        description: 'Please upload a PDF file only.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingResume(true);
    try {
      // Get Firebase auth token
      const { getAuth } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      const token = await getAuth().currentUser?.getIdToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      // Upload to Supabase Storage
      const fileName = `${userId}_${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update user profile with resume URL
      const response = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl: publicUrl }),
      });

      if (response.ok) {
        toast({
          title: 'Resume uploaded successfully',
        });
        // Refresh user data
        const { data: updatedUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        if (updatedUser) {
          setUser(updatedUser);
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload resume.',
        variant: 'destructive',
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, bio, skills }),
      });

      if (response.ok) {
        toast({
          title: 'Profile updated successfully',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your skills and technologies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., React, Python, Design"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>Upload your resume (PDF format, max 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          {user?.resume_url ? (
            <div className="flex items-center justify-between p-4 border rounded">
              <span className="text-sm">Resume uploaded</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={user.resume_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={uploadingResume}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingResume ? 'Uploading...' : 'Replace'}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={uploadingResume}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingResume ? 'Uploading...' : 'Upload Resume'}
            </Button>
          )}
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleResumeUpload}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
