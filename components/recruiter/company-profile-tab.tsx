'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyProfileTabProps {
  userId: string;
}

export function CompanyProfileTab({ userId }: CompanyProfileTabProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');

  useEffect(() => {
    fetchCompany();
  }, [userId]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/recruiter/company?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.company) {
          setCompany(data.company);
          setCompanyName(data.company.company_name || '');
          setDescription(data.company.description || '');
          setWebsite(data.company.website || '');
          setLocation(data.company.location || '');
          setIndustry(data.company.industry || '');
          setCompanySize(data.company.company_size || '');
        }
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiter/company', {
        method: company ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          description,
          website,
          location,
          industry,
          companySize,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Company profile saved successfully',
        });
        fetchCompany();
      } else {
        throw new Error('Failed to save company profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {company && !company.approved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Your company profile is pending approval by our admin team. You can create it, but it won't be visible until approved.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900">Company Information</CardTitle>
            <CardDescription>Provide details about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-700">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Company Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell students about your company..."
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-700">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Mumbai, India"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-gray-700">Industry</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Technology, Finance, etc."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-gray-700">Company Size</Label>
                <Input
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  placeholder="1-10, 11-50, 51-200, etc."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={handleSave}
          disabled={loading || !companyName || !description || !location}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? 'Saving...' : company ? 'Update Company Profile' : 'Create Company Profile'}
        </Button>
      </motion.div>
    </div>
  );
}
