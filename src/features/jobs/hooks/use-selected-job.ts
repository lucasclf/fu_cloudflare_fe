import { useMemo, useState } from "react";

import type { JobCatalogItem } from "../types/job";

type UseSelectedJobParams = {
  jobs: readonly JobCatalogItem[];
};

type UseSelectedJobResult = {
  selectedJobId: number | null;
  selectedCatalogJob: JobCatalogItem | null;
  selectJob: (jobId: number) => void;
  clearSelectedJob: () => void;
};

export function useSelectedJob({
  jobs,
}: UseSelectedJobParams): UseSelectedJobResult {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const selectedCatalogJob = useMemo(() => {
    if (selectedJobId === null) {
      return null;
    }

    return jobs.find((job) => job.id === selectedJobId) ?? null;
  }, [jobs, selectedJobId]);

  function selectJob(jobId: number) {
    setSelectedJobId(jobId);
  }

  function clearSelectedJob() {
    setSelectedJobId(null);
  }

  return {
    selectedJobId,
    selectedCatalogJob,
    selectJob,
    clearSelectedJob,
  };
}
