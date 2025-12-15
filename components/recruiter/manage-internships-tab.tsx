import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, DollarSign, Clock, Users, Edit, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ManageInternshipsTabProps {
  userId: string;
}

export async function ManageInternshipsTab({ userId }: ManageInternshipsTabProps) {
  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('id')
    .eq('recruiter_id', userId)
    .single();

  if (!company) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="py-16 text-center">
            <p className="text-xl text-gray-600">Create a company profile first</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const { data: internships } = await supabaseAdmin
    .from('internships')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  if (!internships || internships.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No internships posted yet</p>
            <p className="text-gray-500">Post your first internship to attract talented students</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {internships.map((internship: any, index: number) => (
        <motion.div
          key={internship.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 text-gray-900">{internship.title}</CardTitle>
                  <CardDescription className="text-gray-600">{internship.category}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(internship.status)} shadow-sm`} variant="secondary">
                  {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Stipend:</span> ₹{internship.stipend_min.toLocaleString('en-IN')}/month
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Duration:</span> {internship.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">Openings:</span> {internship.openings}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Posted {new Date(internship.created_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                    <Eye className="h-4 w-4 mr-1" />
                    View Applications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
