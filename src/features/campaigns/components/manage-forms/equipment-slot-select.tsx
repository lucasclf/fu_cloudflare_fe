type EquipmentSlotSelectProps = {
  id: string;
  label: string;
  options: { id: number; name: string }[];
  value: number | null;
  onChange: (value: number | null) => void;
};

export function EquipmentSlotSelect({
  id,
  label,
  options,
  value,
  onChange,
}: EquipmentSlotSelectProps) {
  return (
    <div className="manage-form__field">
      <label htmlFor={id} className="manage-form__label">{label}</label>
      <select
        id={id}
        className="manage-form__select"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      >
        <option value="">Nenhum</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}
