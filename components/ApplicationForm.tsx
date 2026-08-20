"use client";

import { FormEvent, useState } from "react";
import { ApiError, submitApplication } from "@/lib/api";
import type { Application, CandidateApplicationInput } from "@/lib/types";
import ResumeUpload from "@/components/ResumeUpload";
import { isValidPhoneNumber } from "@/lib/validation";

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Product Designer",
  "Product Manager",
  "Data Analyst",
] as const;

const EMPTY_INPUT: CandidateApplicationInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  portfolioUrl: "",
  resume: null,
  coverNote: "",
};

type FieldErrors = Partial<Record<keyof CandidateApplicationInput, string>>;

function validateClientSide(input: CandidateApplicationInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!input.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Enter a valid email address.";
  if (!isValidPhoneNumber(input.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!input.role) errors.role = "Select the role you're applying for.";
  if (input.portfolioUrl.trim() && !/^https?:\/\/.+/i.test(input.portfolioUrl)) {
    errors.portfolioUrl = "Enter a link starting with http:// or https://.";
  }
  if (!input.resume) errors.resume = "Upload your resume.";
  if (input.resume && input.resume.size > 5 * 1024 * 1024) {
    errors.resume = "Your resume must be 5 MB or smaller.";
  } else if (input.resume && !/\.(pdf|doc|docx)$/i.test(input.resume.name)) {
    errors.resume = "Upload a PDF, DOC, or DOCX file.";
  }
  if (input.coverNote.trim().length < 20) errors.coverNote = "Enter at least 20 characters.";
  return errors;
}

interface ApplicationFormProps {
  onSubmitted: (application: Application) => void;
}

export default function ApplicationForm({ onSubmitted }: ApplicationFormProps) {
  const [input, setInput] = useState<CandidateApplicationInput>(EMPTY_INPUT);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<Application | null>(null);
  const [resumeResetKey, setResumeResetKey] = useState(0);

  function updateField<K extends keyof CandidateApplicationInput>(key: K, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setLastSubmitted(null);

    const clientErrors = validateClientSide(input);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const application = await submitApplication(input);
      setLastSubmitted(application);
      setInput(EMPTY_INPUT);
      setResumeResetKey((key) => key + 1);
      setFieldErrors({});
      onSubmitted(application);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setFormError("Something went wrong. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-600">Application</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-black">Apply for a role</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Complete the form and we’ll provide a tracking code when your application is received.
        </p>
      </div>

      {lastSubmitted && (
        <div
          role="status"
          className="mb-6 rounded-md border border-neutral-400 bg-neutral-100 px-4 py-3 text-sm text-black"
        >
          <p className="font-medium">Application received.</p>
          <p className="mt-1 font-mono text-xs text-neutral-700">
            Tracking code: {lastSubmitted.trackingCode}
          </p>
        </div>
      )}

      {formError && (
        <div role="alert" className="mb-6 rounded-md border border-black bg-neutral-100 px-4 py-3 text-sm text-black">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={fieldErrors.firstName}>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={input.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="John"
              disabled={submitting}
              className={inputClasses(!!fieldErrors.firstName)}
            />
          </Field>

          <Field label="Last name" htmlFor="lastName" error={fieldErrors.lastName}>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={input.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="James"
              disabled={submitting}
              className={inputClasses(!!fieldErrors.lastName)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" error={fieldErrors.email}>
            <input
              id="email"
              type="email"
              value={input.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="candidate@email.com"
              disabled={submitting}
              className={inputClasses(!!fieldErrors.email)}
            />
          </Field>

          <Field label="Phone" htmlFor="phone" error={fieldErrors.phone}>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={input.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+234 800 000 0000"
              disabled={submitting}
              className={inputClasses(!!fieldErrors.phone)}
            />
          </Field>
        </div>

        <Field label="Role" htmlFor="role" error={fieldErrors.role}>
          <select
            id="role"
            value={input.role}
            onChange={(e) => updateField("role", e.target.value)}
            disabled={submitting}
            className={inputClasses(!!fieldErrors.role)}
          >
            <option value="" disabled>
              Select a role
            </option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Portfolio link (optional)" htmlFor="portfolioUrl" error={fieldErrors.portfolioUrl}>
          <input
            id="portfolioUrl"
            type="url"
            value={input.portfolioUrl}
            onChange={(e) => updateField("portfolioUrl", e.target.value)}
            placeholder="https://your-work.com"
            disabled={submitting}
            className={inputClasses(!!fieldErrors.portfolioUrl)}
          />
        </Field>

        <ResumeUpload
          disabled={submitting}
          error={fieldErrors.resume}
          resetKey={resumeResetKey}
          onChange={(file) => {
            setInput((previous) => ({ ...previous, resume: file }));
            setFieldErrors((previous) => ({ ...previous, resume: undefined }));
          }}
        />

        <Field label="Cover note" htmlFor="coverNote" error={fieldErrors.coverNote}>
          <textarea
            id="coverNote"
            value={input.coverNote}
            onChange={(e) => updateField("coverNote", e.target.value)}
            placeholder="Tell us why this role is a fit."
            rows={5}
            disabled={submitting}
            className={inputClasses(!!fieldErrors.coverNote)}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 font-body text-sm font-semibold text-white shadow-md transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting && <Spinner />}
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return [
    "w-full rounded-lg border-0 bg-neutral-100 px-3.5 py-2.5 text-sm text-ink shadow-none placeholder:text-ink-soft/50",
    "transition-colors focus:bg-white focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-60",
    hasError ? "ring-2 ring-red-200" : "ring-0",
  ].join(" ");
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-paper"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
