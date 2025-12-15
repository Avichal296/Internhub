-- InternMatch Row Level Security Policies
-- Execute this AFTER running schema.sql

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id);

-- Companies Table Policies
-- Anyone can view approved companies
CREATE POLICY "Anyone can view approved companies"
  ON companies FOR SELECT
  USING (approved = true OR recruiter_id = auth.uid()::text);

-- Recruiters can insert their own companies
CREATE POLICY "Recruiters can insert own company"
  ON companies FOR INSERT
  WITH CHECK (
    recruiter_id = auth.uid()::text AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'recruiter')
  );

-- Recruiters can update their own companies
CREATE POLICY "Recruiters can update own company"
  ON companies FOR UPDATE
  USING (recruiter_id = auth.uid()::text);

-- Admins can update any company
CREATE POLICY "Admins can update any company"
  ON companies FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
  );

-- Internships Table Policies
-- Anyone can view approved internships
CREATE POLICY "Anyone can view approved internships"
  ON internships FOR SELECT
  USING (
    status = 'approved' OR
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = internships.company_id AND c.recruiter_id = auth.uid()::text
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
  );

-- Recruiters can insert internships for their companies
CREATE POLICY "Recruiters can insert own internships"
  ON internships FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = company_id AND c.recruiter_id = auth.uid()::text
    )
  );

-- Recruiters can update their own internships
CREATE POLICY "Recruiters can update own internships"
  ON internships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = internships.company_id AND c.recruiter_id = auth.uid()::text
    )
  );

-- Admins can update any internship
CREATE POLICY "Admins can update any internship"
  ON internships FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
  );

-- Admins can delete internships
CREATE POLICY "Admins can delete internships"
  ON internships FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
  );

-- Applications Table Policies
-- Students can view their own applications
CREATE POLICY "Students can view own applications"
  ON applications FOR SELECT
  USING (user_id = auth.uid()::text);

-- Recruiters can view applications for their internships
CREATE POLICY "Recruiters can view applications for own internships"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.id = applications.internship_id AND c.recruiter_id = auth.uid()::text
    )
  );

-- Students can insert applications (apply once per internship)
CREATE POLICY "Students can apply to internships"
  ON applications FOR INSERT
  WITH CHECK (
    user_id = auth.uid()::text AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'student')
  );

-- Recruiters can update application status
CREATE POLICY "Recruiters can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.id = applications.internship_id AND c.recruiter_id = auth.uid()::text
    )
  );

-- Saved Internships Table Policies
-- Students can view their own saved internships
CREATE POLICY "Students can view own saved internships"
  ON saved_internships FOR SELECT
  USING (user_id = auth.uid()::text);

-- Students can save internships
CREATE POLICY "Students can save internships"
  ON saved_internships FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- Students can unsave internships
CREATE POLICY "Students can unsave internships"
  ON saved_internships FOR DELETE
  USING (user_id = auth.uid()::text);

-- Notifications Table Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid()::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()::text);

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
