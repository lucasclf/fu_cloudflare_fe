import type { CSSProperties } from "react";

type Props = {
  offensiveOnly: boolean;
  onChange: (value: boolean) => void;
};

export function SpellOffensiveToggle({ offensiveOnly, onChange }: Props) {
  return (
    <button
      type="button"
      aria-pressed={offensiveOnly}
      onClick={() => onChange(!offensiveOnly)}
      style={{
        ...styles.button,
        ...(offensiveOnly ? styles.buttonActive : {}),
      }}
    >
      <span
        aria-hidden="true"
        style={{
          ...styles.toggle,
          ...(offensiveOnly ? styles.toggleActive : {}),
        }}
      >
        <span
          style={{
            ...styles.knob,
            ...(offensiveOnly ? styles.knobActive : {}),
          }}
        />
      </span>

      <span style={styles.text}>Somente ofensivas</span>
    </button>
  );
}

const styles: Record<string, CSSProperties> = {
  button: {
    width: "100%",
    border: "1px solid #34291f",
    borderRadius: "8px",
    background: "#110e0c",
    color: "#7a6e5a",
    padding: "9px 10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    textAlign: "left",
  },
  buttonActive: {
    background: "#1e1a16",
    color: "#f5efe2",
    borderColor: "#c9963a",
    boxShadow: "0 0 0 1px rgba(201, 150, 58, 0.18)",
  },
  toggle: {
    width: "34px",
    height: "18px",
    borderRadius: "999px",
    background: "#2a231d",
    border: "1px solid #3a2e22",
    padding: "2px",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
  },
  toggleActive: {
    background: "#7a5a22",
    borderColor: "#c9963a",
    justifyContent: "flex-end",
  },
  knob: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "#5f574c",
  },
  knobActive: {
    background: "#f5efe2",
  },
  text: {
    fontSize: "13px",
    fontWeight: 700,
  },
};