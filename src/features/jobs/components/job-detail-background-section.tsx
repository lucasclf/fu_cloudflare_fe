import { JobDetailInfo } from "./job-detail-info";
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
          <div className="job-detail-panel__subsection">
            <h3 className="job-detail-panel__subsection-title">
              {JOBS_CATALOG_CONFIG.copy.detail.background.aliasesTitle}
            </h3>

            <div className="job-detail-panel__aliases">
              {aliases.map((alias) => (
                <span key={alias.id} className="job-detail-panel__alias-badge">
                  {getAliasText(alias)}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {questions.length > 0 ? (
          <div className="job-detail-panel__subsection">
            <h3 className="job-detail-panel__subsection-title">
              {JOBS_CATALOG_CONFIG.copy.detail.background.questionsTitle}
            </h3>

            <div className="job-detail-panel__list">
              {questions.map((question, index) => (
                <JobDetailInfo
                  key={question.id}
                  label={`${JOBS_CATALOG_CONFIG.copy.detail.background.questionLabel} ${
                    index + 1
                  }`}
                  value={getQuestionText(question)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </JobDetailSection>
  );
}
