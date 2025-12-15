import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('recruiter_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Create a company profile first' }, { status: 400 });
    }

    const {
      title,
      category,
      description,
      responsibilities,
      stipendMin,
      stipendMax,
      location,
      isWfh,
      duration,
      openings,
      perks,
      skillsRequired,
    } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('internships')
      .insert({
        company_id: company.id,
        title,
        category,
        description,
        responsibilities,
        stipend_min: stipendMin,
        stipend_max: stipendMax,
        location: isWfh ? 'Remote' : location,
        is_wfh: isWfh,
        duration,
        openings,
        perks,
        skills_required: skillsRequired,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, internship: data });
  } catch (error) {
    console.error('Internship creation error:', error);
    return NextResponse.json({ error: 'Failed to create internship' }, { status: 500 });
  }
}
