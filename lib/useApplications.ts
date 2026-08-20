"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, fetchApplications } from "@/lib/api";
import type { Application } from "@/lib/types";

export type RegistryStatus = "idle" | "loading" | "error" | "ready";

interface UseApplicationsResult {
  applications: Application[];
  status: RegistryStatus;
  errorMessage: string | null;
  refetch: () => void;
  addApplication: (application: Application) => void;
}

export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState<RegistryStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setErrorMessage(null);

    fetchApplications(controller.signal)
      .then((data) => {
        setApplications(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof ApiError ? err.message : "Couldn't load applications.";
        setErrorMessage(message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  const addApplication = useCallback((application: Application) => {
    setApplications((prev) => [application, ...prev]);
  }, []);

  return { applications, status, errorMessage, refetch: load, addApplication };
}
