'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostInternshipTabProps {
  userId: string;
}

export function PostInternshipTab({ userId }: PostInternshipTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [stipendMin, setStipendMin] = useState('');
  const [stipendMax, setStipendMax] = useState('');
  const [location, setLocation] = useState('');
  const [isWfh, setIsWfh] = useState(false);
  const [duration, setDuration] = useState('');
  const [openings, setOpenings] = useState('1');
  const [perks, setPerks] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    checkCompany();
  }, [userId]);

  const checkCompany = async () => {
    try {
      const response = await fetch(`/api/recruiter/company?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHasCompany(!!data.company);
      }
    } catch (error) {
      console.error('Error checking company:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiter/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          responsibilities,
          stipendMin: parseInt(stipendMin) || 0,
          stipendMax: parseInt(stipendMax) || parseInt(stipendMin) || 0,
          location,
          isWfh,
          duration,
          openings: parseInt(openings) || 1,
          perks,
          skillsRequired: skills,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Internship posted successfully',
          description: 'Your posting will be reviewed by our admin team',
        });
        
        setTitle('');
        setCategory('');
        setDescription('');
        setResponsibilities('');
        setStipendMin('');
        setStipendMax('');
        setLocation('');
        setIsWfh(false);
        setDuration('');
        setOpenings('1');
        setPerks('');
        setSkills([]);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post internship');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasCompany) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-xl text-gray-600 mb-4">Create a company profile first</p>
          <p className="text-gray-500">You need to set up your company profile before posting internships</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post New Internship</CardTitle>
          <CardDescription>Fill in the details to create an internship posting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Internship Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer Intern"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Engineering, Design, Marketing"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the internship opportunity..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <Textarea
              id="responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="What will the intern be working on?"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stipendMin">Minimum Stipend (₹/month) *</Label>
              <Input
                id="stipendMin"
                type="number"
                value={stipendMin}
                onChange={(e) => setStipendMin(e.target.value)}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stipendMax">Maximum Stipend (₹/month)</Label>
              <Input
                id="stipendMax"
                type="number"
                value={stipendMax}
                onChange={(e) => setStipendMax(e.target.value)}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3 months"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openings">Number of Openings *</Label>
              <Input
                id="openings"
                type="number"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mumbai"
                disabled={isWfh}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="wfh"
              checked={isWfh}
              onCheckedChange={setIsWfh}
            />
            <Label htmlFor="wfh">Work From Home</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="perks">Perks</Label>
            <Input
              id="perks"
              value={perks}
              onChange={(e) => setPerks(e.target.value)}
              placeholder="Certificate, Letter of Recommendation, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Skills Required</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill} type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !title || !category || !description || !stipendMin || !duration}
          size="lg"
        >
          {loading ? 'Posting...' : 'Post Internship'}
        </Button>
      </div>
    </div>
  );
}
