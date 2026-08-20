import { NextRequest, NextResponse } from "next/server";
import type { Application, CandidateApplicationInput } from "@/lib/types";

let applications: Application[] = [];

function makeTrackingCode(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `CA-${stamp}-${rand}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(input: Partial<CandidateApplicationInput>) {
  const fieldErrors: Partial<Record<keyof CandidateApplicationInput, string>> = {};

  if (!input.firstName || input.firstName.trim().length < 1) {
    fieldErrors.firstName = "Enter your first name.";
  }
  if (!input.lastName || input.lastName.trim().length < 1) {
    fieldErrors.lastName = "Enter your last name.";
  }
  if (!input.email || !EMAIL_RE.test(input.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!input.phone || input.phone.trim().length < 7) {
    fieldErrors.phone = "Enter a valid phone number.";
  }
  if (!input.role) {
    fieldErrors.role = "Select the role you're applying for.";
  }
  if (input.portfolioUrl && !/^https?:\/\/.+/i.test(input.portfolioUrl)) {
    fieldErrors.portfolioUrl = "Enter a valid link.";
  }
  if (!(input.resume instanceof File) || input.resume.size === 0) {
    fieldErrors.resume = "Upload your resume.";
  } else if (input.resume.size > 5 * 1024 * 1024) {
    fieldErrors.resume = "Your resume must be 5 MB or smaller.";
  } else if (!/\.(pdf|doc|docx)$/i.test(input.resume.name)) {
    fieldErrors.resume = "Upload a PDF, DOC, or DOCX file.";
  }
  if (!input.coverNote || input.coverNote.trim().length < 20) {
    fieldErrors.coverNote = "Input must be at least 20 characters.";
  }

  return fieldErrors;
}

export async function GET() {
  await delay(600);
  const sorted = [...applications].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  return NextResponse.json({ applications: sorted });
}

export async function POST(request: NextRequest) {
  await delay(900);

  let body: Partial<CandidateApplicationInput>;
  try {
    const formData = await request.formData();
    body = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      role: String(formData.get("role") ?? ""),
      portfolioUrl: String(formData.get("portfolioUrl") ?? ""),
      resume: formData.get("resume") as File | null,
      coverNote: String(formData.get("coverNote") ?? ""),
    };
  } catch {
    return NextResponse.json({ error: "The submitted form data isn't valid." }, { status: 400 });
  }

  const fieldErrors = validate(body);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Fix the highlighted fields and resubmit.", fieldErrors },
      { status: 422 }
    );
  }

  const application: Application = {
    id: crypto.randomUUID(),
    trackingCode: makeTrackingCode(),
    firstName: body.firstName!.trim(),
    lastName: body.lastName!.trim(),
    email: body.email!.trim(),
    phone: body.phone!.trim(),
    role: body.role!,
    portfolioUrl: body.portfolioUrl?.trim() ?? "",
    resumeFileName: body.resume!.name,
    coverNote: body.coverNote!.trim(),
    status: "received",
    submittedAt: new Date().toISOString(),
  };

  applications.push(application);

  return NextResponse.json({ application }, { status: 201 });
}
