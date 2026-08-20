import type { ApplicationStatus } from "@/lib/types";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; classes: string }> = {
  received: { label: "Received", classes: "bg-neutral-100 text-black border-neutral-400" },
  in_review: { label: "In review", classes: "bg-neutral-200 text-black border-neutral-500" },
  advanced: { label: "Advanced", classes: "bg-black text-white border-black" },
  declined: { label: "Declined", classes: "bg-white text-black border-black" },
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${config.classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {config.label}
    </span>
  );
}
