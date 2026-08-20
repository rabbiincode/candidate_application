import type { Application } from "@/lib/types";
import type { RegistryStatus } from "@/lib/useApplications";
import StatusBadge from "@/components/StatusBadge";

interface ApplicationListProps {
  applications: Application[];
  status: RegistryStatus;
  errorMessage: string | null;
  onRetry: () => void;
}

export default function ApplicationList({
  applications,
  status,
  errorMessage,
  onRetry,
}: ApplicationListProps) {
  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-600">Registry</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-black">Application status</h2>
        </div>
        {status === "ready" && (
          <span className="font-mono text-xs text-ink-soft">
            {applications.length} on file
          </span>
        )}
      </div>

      {status === "loading" && <LoadingState />}
      {status === "error" && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {status === "ready" && applications.length === 0 && <EmptyState />}
      {status === "ready" && applications.length > 0 && (
        <ul className="space-y-5">
          {applications.map((application) => (
            <li key={application.id}>
              <ApplicationStub application={application} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ApplicationStub({ application }: { application: Application }) {
  const submitted = new Date(application.submittedAt);
  return (
    <div className="stub grid grid-cols-3 overflow-hidden rounded-md shadow-sm">
      <div className="col-span-2 p-4">
        <p className="font-display text-lg text-ink">
          {application.firstName} {application.lastName}
        </p>
        <p className="mt-0.5 text-sm text-ink-soft">{application.role}</p>
        <p className="mt-3 font-mono text-[11px] text-ink-soft">
          {submitted.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          · {submitted.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <div className="relative col-span-1 flex flex-col items-center justify-center gap-2 bg-neutral-100 p-4">
        <StatusBadge status={application.status} />
        <p className="font-mono text-[10px] tracking-wider text-ink-soft">
          {application.trackingCode}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <ul className="space-y-5" aria-busy="true" aria-live="polite">
      {[0, 1, 2].map((i) => (
        <li key={i} className="animate-pulse overflow-hidden rounded-md border border-line">
          <div className="grid grid-cols-3">
            <div className="col-span-2 space-y-2 p-4">
              <div className="h-4 w-2/3 rounded bg-neutral-300" />
              <div className="h-3 w-1/3 rounded bg-neutral-200" />
              <div className="mt-3 h-2.5 w-1/2 rounded bg-neutral-200" />
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-2 bg-paper-dim p-4">
              <div className="h-5 w-16 rounded-full bg-neutral-300" />
              <div className="h-2.5 w-14 rounded bg-neutral-200" />
            </div>
          </div>
        </li>
      ))}
      <span className="sr-only">Loading applications…</span>
    </ul>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-md border border-black bg-neutral-100 p-6 text-center" role="alert">
      <p className="font-display text-lg font-medium text-black">Couldn't load the registry</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-neutral-700">
        {message ?? "Something went wrong while fetching applications."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-line p-10 text-center">
      <p className="font-display text-lg font-medium text-ink">No applications yet</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-ink-soft">
        Submit the form on the left — your entry will appear here with a tracking code the moment
        it's filed.
      </p>
    </div>
  );
}
