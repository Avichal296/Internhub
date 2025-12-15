'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Bookmark, User, TrendingUp, CheckCircle, AlertCircle, Bell } from 'lucide-react';

interface DashboardOverviewProps {
  stats: {
    totalApplications: number;
    savedInternships: number;
    profileCompletion: number;
  };
  profileCompletion: {
    personal: number;
    education: number;
    skills: number;
    resume: number;
  };
  latestNotifications: any[];
}

export function DashboardOverview({ stats, profileCompletion, latestNotifications }: DashboardOverviewProps) {
  const overviewCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Saved Internships',
      value: stats.savedInternships,
      icon: Bookmark,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Profile Completion',
      value: `${stats.profileCompletion}%`,
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      showProgress: true,
    },
    {
      title: 'Latest Notifications',
      value: latestNotifications?.length ?? 0,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const profileSections = [
    { name: 'Personal Information', progress: profileCompletion.personal, icon: User },
    { name: 'Education', progress: profileCompletion.education, icon: FileText },
    { name: 'Skills', progress: profileCompletion.skills, icon: TrendingUp },
    { name: 'Resume', progress: profileCompletion.resume, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.showProgress && (
                <Progress value={stats.profileCompletion} className="mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Completion Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileSections.map((section, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{section.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={section.progress} className="w-20" />
                  <span className="text-sm text-gray-600 w-8">{section.progress}%</span>
                  {section.progress === 100 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {stats.profileCompletion < 100 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Complete your profile to increase your chances of getting selected!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
