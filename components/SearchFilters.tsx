'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';

interface SearchFiltersProps {
  initialSearch?: string;
  initialLocation?: string;
  initialCategory?: string;
  initialStipendMin?: string;
  initialStipendMax?: string;
  initialDuration?: string;
  initialRemote?: string;
}

export function SearchFilters({
  initialSearch = '',
  initialLocation = '',
  initialCategory = '',
  initialStipendMin = '',
  initialStipendMax = '',
  initialDuration = '',
  initialRemote = '',
}: SearchFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [stipendMin, setStipendMin] = useState(initialStipendMin);
  const [stipendMax, setStipendMax] = useState(initialStipendMax);
  const [duration, setDuration] = useState(initialDuration);
  const [remote, setRemote] = useState(initialRemote);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    if (stipendMin) params.set('stipend_min', stipendMin);
    if (stipendMax) params.set('stipend_max', stipendMax);
    if (duration) params.set('duration', duration);
    if (remote) params.set('remote', remote);

    router.push(`/internships?${params.toString()}`);
  };

  const categories = [
    'Technology',
    'Marketing',
    'Finance',
    'Design',
    'Operations',
    'Human Resources',
    'Sales',
    'Content Writing',
    'Data Analysis',
    'Engineering',
  ];

  const durations = ['1 month', '2 months', '3 months', '6 months'];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Internships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Profile/Title
            </label>
            <Input
              placeholder="e.g. Software Engineer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              placeholder="e.g. Mumbai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Stipend Range
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={stipendMin}
                onChange={(e) => setStipendMin(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={stipendMax}
                onChange={(e) => setStipendMax(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur} value={dur}>
                    {dur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Remote Work</label>
            <Select value={remote} onValueChange={setRemote}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
