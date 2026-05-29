import styles from "./spell-offensive-toggle.module.css";

type SpellOffensiveToggleProps = {
  offensiveOnly: boolean;
  onChange: (value: boolean) => void;
};

export function SpellOffensiveToggle({
  offensiveOnly,
  onChange,
}: SpellOffensiveToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={offensiveOnly}
      onClick={() => onChange(!offensiveOnly)}
      className={`${styles.button} ${offensiveOnly ? styles.buttonActive : ""}`}
    >
      <span
        aria-hidden="true"
        className={`${styles.toggle} ${offensiveOnly ? styles.toggleActive : ""}`}
      >
        <span
          className={`${styles.knob} ${offensiveOnly ? styles.knobActive : ""}`}
        />
      </span>

      <span className={styles.label}>Somente ofensivas</span>
    </button>
  );
}
