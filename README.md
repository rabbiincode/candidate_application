# Candidate Application

A small candidate application built with Next.js, TypeScript, and Tailwind CSS.
It includes client and server validation plus loading, error, empty, submitting,
and success states.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/api/applications/route.ts`: GET and POST API handlers
- `components/ApplicationForm.tsx`: form state and submission
- `components/ResumeUpload.tsx`: resume file input
- `components/ApplicationList.tsx`: list and request states
- `components/StatusBadge.tsx`: application status label
- `lib/api.ts`: typed API client
- `lib/useApplications.ts`: application list state
- `lib/types.ts`: shared types

## API behavior

`POST /api/applications` accepts multipart form data. First name, last name,
email, phone, role, resume, and a cover note of at least 20 characters are
required. The portfolio URL is optional. Resumes must be PDF, DOC, or DOCX and
no larger than 5 MB.

## Demo limitations

- Applications are stored in memory and are cleared when the server restarts.
- The uploaded resume file is validated, but only its filename is recorded; the
  file itself is not persisted.
- The recent applications panel is included to demonstrate list states. A
  production candidate facing page should not expose other applicants and
  would require authentication and separate candidate/reviewer views.
