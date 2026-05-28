import { useCallback } from "react";


import { getPublicJobById } from "../api/get-public-job-by-id";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import type { Job } from "../types/job";
import { type AsyncResourceByKeyState, useAsyncResourceByKey } from "./use-async-resource-by-key";

type UsePublicJobDetailResult = {
  job: Job | null;
  loading: boolean;
  error: string | null;
};

export function usePublicJobDetail(
  jobId: number | null,
): UsePublicJobDetailResult {
  const loadJobDetail = useCallback(
    (selectedJobId: number, signal: AbortSignal) => {
      return getPublicJobById(selectedJobId, signal);
    },
    [],
  );

  const getErrorMessage = useCallback((error: unknown) => {
    return error instanceof Error
      ? error.message
      : JOBS_CATALOG_CONFIG.copy.detail.errorMessage;
  }, []);

  const {
    data: job,
    loading,
    error,
  }: AsyncResourceByKeyState<Job> = useAsyncResourceByKey({
    keyValue: jobId,
    loader: loadJobDetail,
    getErrorMessage,
  });

  return {
    job,
    loading,
    error,
  };
}