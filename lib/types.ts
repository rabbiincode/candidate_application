export type ApplicationStatus = "received" | "in_review" | "advanced" | "declined";

export interface Application {
  id: string;
  trackingCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  portfolioUrl: string;
  resumeFileName: string;
  coverNote: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export interface CandidateApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  portfolioUrl: string;
  resume: File | null;
  coverNote: string;
}

export interface ApiErrorBody {
  error: string;
  fieldErrors?: Partial<Record<keyof CandidateApplicationInput, string>>;
}
