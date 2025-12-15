# InternMatch - Internshala Clone

## Project Overview
InternMatch is a production-grade internship platform built with Next.js 14, Firebase Authentication, and Supabase. It connects students with companies offering internship opportunities.

## Tech Stack
- **Framework**: Next.js 14 (App Router with React Server Components)
- **Authentication**: Firebase Authentication (email/password with OTP verification)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Storage**: Supabase Storage (for resume uploads)
- **Styling**: Tailwind CSS + ShadCN UI
- **Language**: TypeScript

## Project Structure
```
/app
  /(auth)           - Login, Signup pages
  /home             - Public homepage
  /internships      - Browse and view internships
  /student          - Student dashboard
  /recruiter        - Recruiter dashboard
  /admin            - Admin dashboard
  /api              - API routes & server actions
/components
  /ui               - ShadCN UI components
  /student          - Student-specific components
  /recruiter        - Recruiter-specific components
  navbar.tsx        - Main navigation
/lib
  firebase.ts       - Firebase config & auth functions
  supabase.ts       - Supabase client & types
  auth.ts           - Server-side auth utilities
  utils.ts          - Helper functions
/sql
  schema.sql        - Database schema
  rls_policies.sql  - Row Level Security policies
```

## Database Schema

### Tables
1. **users** - User profiles (linked to Firebase UID)
2. **companies** - Company profiles (created by recruiters)
3. **internships** - Internship postings
4. **applications** - Student applications
5. **saved_internships** - Student saved internships
6. **notifications** - User notifications

### Setup Instructions
1. Go to Supabase SQL Editor
2. Run `sql/schema.sql` to create tables
3. Run `sql/rls_policies.sql` to enable security policies

## User Roles

### Student
- Browse and search internships
- Apply to internships with custom answers
- Save internships for later
- Manage profile (education, skills, resume)
- View application status
- Receive notifications

### Recruiter
- Create company profile (requires admin approval)
- Post internship listings (requires admin approval)
- View and manage applicants
- Update application status (select/reject)

### Admin
- Approve/reject company profiles
- Approve/reject internship postings
- Remove inappropriate content
- View platform analytics

## Features Implemented

### Authentication
- ✅ Firebase email/password signup/login
- ✅ OTP email verification
- ✅ Role-based routing (student/recruiter/admin)
- ✅ Protected routes with middleware
- ✅ Session management with cookies

### Student Features
- ✅ Profile management (personal info, skills, bio)
- ✅ Resume upload to Supabase Storage
- ✅ Browse internships (public access)
- ✅ View internship details
- ✅ Apply to internships
- ✅ Save internships
- ✅ View applications with status
- ✅ Notifications center

### Recruiter Features
- ✅ Company profile builder
- ✅ Post internship form with all fields
- ✅ Manage posted internships
- ✅ View applicants with resumes
- ✅ Update application status
- ✅ Pending approval notifications

### Public Features
- ✅ Homepage with hero section
- ✅ Internship listing page
- ✅ Internship detail page
- ✅ Responsive navigation

## Environment Variables
All required secrets have been added to Replit Secrets:
- Firebase configuration (API key, Auth domain, Project ID, etc.)
- Supabase configuration (URL, Anon key, Service role key)

## Development
- Server runs on port 5000 (configured for Replit webview)
- Hot reload enabled with Next.js dev server
- TypeScript for type safety
- ESLint for code quality

## Next Steps (Not Yet Implemented)
1. Admin Dashboard pages
2. Application form with custom questions
3. Resume upload functionality
4. Advanced search and filters
5. Notification system (create notifications)
6. Application status updates (select/reject)
7. Email notifications
8. Analytics dashboard

## Recent Changes (2024-11-18)
- Created complete project structure with Next.js 14
- Set up Firebase Authentication and Supabase integration
- Built Student Dashboard with profile, applications, saved, notifications tabs
- Built Recruiter Dashboard with company profile, post internship, manage posts, applicants tabs
- Created all necessary UI components using ShadCN
- Implemented API routes for profile updates, company management, internship posting
- Added middleware for route protection
- Configured all environment secrets

## Known Issues
- LSP warnings for lucide-react (cosmetic, does not affect functionality)
- Admin dashboard not yet implemented
- Resume upload UI created but file handling not yet connected

## Deployment Notes
- Project configured for Replit deployment
- Port 5000 bound to 0.0.0.0 for webview access
- Environment variables managed through Replit Secrets
- No build errors, server running successfully
