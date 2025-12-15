import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('recruiter_id', userId)
      .single();

    return NextResponse.json({ company });
  } catch (error) {
    return NextResponse.json({ company: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyName, description, website, location, industry, companySize } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('companies')
      .insert({
        recruiter_id: user.id,
        company_name: companyName,
        description,
        website,
        location,
        industry,
        company_size: companySize,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, company: data });
  } catch (error) {
    console.error('Company creation error:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyName, description, website, location, industry, companySize } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('companies')
      .update({
        company_name: companyName,
        description,
        website,
        location,
        industry,
        company_size: companySize,
      })
      .eq('recruiter_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, company: data });
  } catch (error) {
    console.error('Company update error:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
