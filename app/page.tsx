"use client";

import ApplicationForm from "@/components/ApplicationForm";
import ApplicationList from "@/components/ApplicationList";
import { useApplications } from "@/lib/useApplications";

export default function Home() {
  const { applications, status, errorMessage, refetch, addApplication } = useApplications();

  return (
    <main className="min-h-screen w-full px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
      <div className="mb-10 flex items-center justify-between rounded-2xl bg-black px-6 py-5 shadow-lg">
        <span className="font-display text-lg font-medium text-white">Careers</span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
          Open roles · Lagos &amp; remote
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section aria-label="Application form" className="rounded-3xl border border-neutral-300 bg-white p-6 shadow-xl sm:p-8">
          <ApplicationForm onSubmitted={addApplication} />
        </section>

        <section aria-label="Application registry" className="rounded-3xl border border-neutral-300 bg-white p-6 shadow-xl sm:p-8">
          <ApplicationList
            applications={applications}
            status={status}
            errorMessage={errorMessage}
            onRetry={refetch}
          />
        </section>
      </div>
    </main>
  );
}
