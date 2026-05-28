type JobDetailInfoProps = {
  label: string;
  value: string;
  compact?: boolean;
};

export function JobDetailInfo({
  label,
  value,
  compact = false,
}: JobDetailInfoProps) {
  return (
    <div
      className={
        compact
          ? "job-detail-panel__info-box job-detail-panel__info-box--compact"
          : "job-detail-panel__info-box"
      }
    >
      <div className="job-detail-panel__info-label">{label}</div>
      <div className="job-detail-panel__info-value">{value}</div>
    </div>
  );
}