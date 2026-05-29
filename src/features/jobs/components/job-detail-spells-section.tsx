import { Badge } from "@/shared/components/badge";
import { ContentCard } from "@/shared/components/content-card";
import { InfoBox } from "@/shared/components/info-box";
import { JobDetailSection } from "./job-detail-section";
import { JOBS_CATALOG_CONFIG } from "../config/jobs-catalog-config";
import {
  getSpellCost,
  getSpellDuration,
  getSpellTarget,
  getSpellType,
  hasItems,
  isSpellOffensive,
} from "../lib/job-detail-formatters";
import { renderOptionalValue, renderTokenLabel } from "../lib/job-formatters";
import type { JobSpell } from "../types/job";

type JobDetailSpellsSectionProps = {
  spells: JobSpell[] | undefined;
};

export function JobDetailSpellsSection({
  spells,
}: JobDetailSpellsSectionProps) {
  if (!hasItems(spells)) {
    return null;
  }

  return (
    <JobDetailSection
      title={JOBS_CATALOG_CONFIG.copy.detail.sections.spells}
      count={spells.length}
      defaultOpen={false}
    >
      <div className="job-detail-panel__list">
        {spells.map((spell) => {
          const spellType = getSpellType(spell);
          const spellCost = getSpellCost(spell);
          const spellTarget = getSpellTarget(spell);
          const spellDuration = getSpellDuration(spell);
          const offensive = isSpellOffensive(spell);

          return (
            <ContentCard key={spell.id} variant="surface">
              <div className="job-detail-panel__card-header">
                <h4 className="job-detail-panel__card-title">{spell.name}</h4>

                <div className="job-detail-panel__inline-badges">
                  {spellType ? (
                    <Badge variant="surface">
                      {renderTokenLabel(spellType)}
                    </Badge>
                  ) : null}

                  {spellCost !== undefined ? (
                    <Badge variant="surface">
                      {JOBS_CATALOG_CONFIG.copy.detail.spells.costLabel}{" "}
                      {renderOptionalValue(spellCost)}
                    </Badge>
                  ) : null}

                  {offensive !== null ? (
                    <Badge variant="surface">
                      {offensive
                        ? JOBS_CATALOG_CONFIG.copy.detail.spells.offensiveLabel
                        : JOBS_CATALOG_CONFIG.copy.detail.spells
                            .nonOffensiveLabel}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="job-detail-panel__spell-meta-grid">
                {spellTarget !== undefined ? (
                  <InfoBox
                    label={JOBS_CATALOG_CONFIG.copy.detail.spells.targetLabel}
                    value={renderOptionalValue(spellTarget)}
                    compact
                  />
                ) : null}

                {spellDuration !== undefined ? (
                  <InfoBox
                    label={JOBS_CATALOG_CONFIG.copy.detail.spells.durationLabel}
                    value={renderOptionalValue(spellDuration)}
                    compact
                  />
                ) : null}
              </div>

              <p className="job-detail-panel__text">{spell.description}</p>
            </ContentCard>
          );
        })}
      </div>
    </JobDetailSection>
  );
}