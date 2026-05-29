import { Badge } from "@/shared/components/badge";
import { ContentSection } from "@/shared/components/content-section";
import { InfoBox } from "@/shared/components/info-box";
import { JobDetailSection } from "./job-detail-section";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import { getAliasText, getQuestionText } from "../lib/job-formatters";
import type { Job } from "../types/job";

type JobDetailBackgroundSectionProps = {
  job: Job;
};

export function JobDetailBackgroundSection({
  job,
}: JobDetailBackgroundSectionProps) {
  const aliases = job.aliases ?? [];
  const questions = job.questions ?? [];
  const count = aliases.length + questions.length;

  if (count === 0) {
    return null;
  }

  return (
    <JobDetailSection
      title={JOBS_CATALOG_CONFIG.copy.detail.sections.background}
      count={count}
    >
      <div className="job-detail-panel__background-content">
        {aliases.length > 0 ? (
          <ContentSection
            title={JOBS_CATALOG_CONFIG.copy.detail.background.aliasesTitle}
          >
            <div className="job-detail-panel__aliases">
              {aliases.map((alias) => (
                <Badge key={alias.id} variant="surface">
                  {getAliasText(alias)}
                </Badge>
              ))}
            </div>
          </ContentSection>
        ) : null}

        {questions.length > 0 ? (
          <ContentSection
            title={JOBS_CATALOG_CONFIG.copy.detail.background.questionsTitle}
          >
            <div className="job-detail-panel__list">
              {questions.map((question, index) => (
                <InfoBox
                  key={question.id}
                  label={`${JOBS_CATALOG_CONFIG.copy.detail.background.questionLabel} ${
                    index + 1
                  }`}
                  value={getQuestionText(question)}
                />
              ))}
            </div>
          </ContentSection>
        ) : null}
      </div>
    </JobDetailSection>
  );
}
