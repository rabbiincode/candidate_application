import type { Application, ApiErrorBody, CandidateApplicationInput } from "@/lib/types";

export class ApiError extends Error {
  fieldErrors?: ApiErrorBody["fieldErrors"];
  status: number;

  constructor(message: string, status: number, fieldErrors?: ApiErrorBody["fieldErrors"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function fetchApplications(signal?: AbortSignal): Promise<Application[]> {
  const res = await fetch("/api/applications", { signal, cache: "no-store" });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(body?.error ?? "Couldn't load applications.", res.status);
  }

  const data = (await res.json()) as { applications: Application[] };
  return data.applications;
}

export async function submitApplication(
  input: CandidateApplicationInput,
  signal?: AbortSignal
): Promise<Application> {
  const formData = new FormData();
  formData.append("firstName", input.firstName);
  formData.append("lastName", input.lastName);
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  formData.append("role", input.role);
  formData.append("portfolioUrl", input.portfolioUrl);
  formData.append("coverNote", input.coverNote);
  if (input.resume) formData.append("resume", input.resume);

  const res = await fetch("/api/applications", {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      body?.error ?? "Couldn't submit your application. Try again.",
      res.status,
      body?.fieldErrors
    );
  }

  const data = (await res.json()) as { application: Application };
  return data.application;
}
