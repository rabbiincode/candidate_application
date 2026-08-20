# Candidate Application

A Next.js (App Router) + TypeScript + Tailwind CSS application form connected
to a real API route, with explicit loading, error, and empty states.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  api/applications/route.ts   API route: GET (list) / POST (create), with
                               server-side validation and an in-memory store.
  layout.tsx                  Fonts (Fraunces / Inter / IBM Plex Mono) + globals.
  page.tsx                    Composes the form and the registry list.
  globals.css                 Tailwind layers + the "ticket stub" record style.
components/
  ApplicationForm.tsx          Controlled form: client-side validation,
                                submitting state, success + error feedback.
  ApplicationList.tsx          Registry list: loading skeleton, error + retry,
                                empty state, and populated ticket-stub records.
  StatusBadge.tsx               Small presentational status pill.
lib/
  types.ts                    Shared Application / input / error types.
  api.ts                      Typed fetch helpers (ApiError with field errors).
  useApplications.ts          Client hook: fetch, abort-on-unmount, refetch,
                               optimistic add after a successful submit.
```

## Design notes

- **API**: `POST /api/applications` accepts multipart form data and validates first and last name,
  email, phone, role, resume, a 20+ character cover note, and an optional portfolio URL. It returns 422 with
  per-field errors on failure, or 201 with the created record — including a
  generated tracking code — on success. `GET /api/applications` returns the
  registry sorted by most recent. Swap the in-memory array in `route.ts` for
  your real database/ATS when you wire this to production infra.
- **States**: the registry panel explicitly renders `loading` (skeleton
  stubs), `error` (message + retry button), `empty` ("no applications yet"),
  and `ready` (populated list) — driven by a single `status` value from
  `useApplications`, no ambiguous boolean flags.
- **Form UX**: client-side validation runs before the request goes out;
  server-side field errors (e.g. from a slower validation rule) are merged
  into the same error state so the UI behaves the same either way.
- **Styling**: Tailwind theme tokens (`paper`, `ink`, `slate`, `gold`, `moss`,
  `rust`) live in `tailwind.config.ts`. The registry entries render as a
  perforated "ticket stub" (see `.stub` in `globals.css`) — the one
  intentional visual signature, kept quiet everywhere else.
