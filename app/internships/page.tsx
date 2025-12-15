'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { MapPin, Briefcase, DollarSign, Clock, Filter, Search, X } from 'lucide-react';

export default function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [stipendRange, setStipendRange] = useState([0, 100000]);
  const [remote, setRemote] = useState(false);
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInternships();
  }, [searchQuery, location, stipendRange, remote, duration, skills, category, sortBy, currentPage]);

  const fetchInternships = async () => {
    setLoading(true);
    let query = supabase
      .from('internships')
      .select(`
        *,
        companies (
          company_name,
          logo_url
        )
      `)
      .eq('status', 'approved');

    // Apply filters
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (stipendRange[0] > 0 || stipendRange[1] < 100000) {
      query = query.gte('stipend_min', stipendRange[0]).lte('stipend_max', stipendRange[1]);
    }
    if (remote) {
      query = query.eq('is_wfh', true);
    }
    if (duration) {
      query = query.eq('duration', duration);
    }
    if (skills) {
      query = query.contains('skills_required', [skills]);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'stipend_high') {
      query = query.order('stipend_max', { ascending: false });
    }

    // Apply pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching internships:', error);
    } else {
      setInternships(data || []);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setStipendRange([0, 100000]);
    setRemote(false);
    setDuration('');
    setSkills('');
    setCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold text-primary">
            InternMatch
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Internships</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Job title, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any duration</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2 months">2 months</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any category</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stipend Range (₹)</label>
                <Slider
                  value={stipendRange}
                  onValueChange={setStipendRange}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{stipendRange[0].toLocaleString()}</span>
                  <span>₹{stipendRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <Input
                  placeholder="e.g., React, Python"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={remote}
                  onCheckedChange={setRemote}
                />
                <label htmlFor="remote" className="text-sm font-medium">
                  Work from home only
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="stipend_high">Highest stipend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {!internships || internships.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">No internships found</p>
              <p className="text-gray-500">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {internships.map((internship: any) => (
              <Link key={internship.id} href={`/internships/${internship.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{internship.title}</CardTitle>
                        <CardDescription className="text-base">
                          {internship.companies?.company_name || 'Company Name'}
                        </CardDescription>
                      </div>
                      {internship.is_wfh && (
                        <Badge variant="secondary">Work From Home</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                    {internship.skills_required && internship.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {internship.skills_required.slice(0, 5).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
