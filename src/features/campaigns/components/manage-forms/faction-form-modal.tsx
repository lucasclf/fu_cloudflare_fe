import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/components/button";
import { createFaction } from "../../api/create-faction";
import { listLocations } from "../../api/list-locations";
import { toSnakeCaseKey } from "@/shared/lib/text-formatters";
import type {
  FactionType,
  FactionLocationRelationType,
  LocationOption,
} from "../../types/campaign";
import { FormModal, type FormProps } from "./form-modal";

const FACTION_TYPE_OPTIONS: readonly { value: FactionType; label: string }[] = [
  { value: "guild", label: "Guilda" },
  { value: "kingdom", label: "Reino" },
  { value: "order", label: "Ordem" },
  { value: "cult", label: "Culto" },
  { value: "clan", label: "Clã" },
  { value: "company", label: "Companhia" },
  { value: "criminal", label: "Organização criminosa" },
  { value: "military", label: "Militar" },
  { value: "other", label: "Outro" },
];

const FACTION_LOCATION_RELATION_TYPE_OPTIONS: readonly { value: FactionLocationRelationType; label: string }[] = [
  { value: "headquarters", label: "Sede" },
  { value: "origin", label: "Origem" },
  { value: "territory", label: "Território" },
  { value: "influence", label: "Influência" },
  { value: "presence", label: "Presença" },
  { value: "enemy_presence", label: "Presença inimiga" },
  { value: "other", label: "Outro" },
];

export function FactionFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [factionType, setFactionType] = useState<FactionType>("other");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [relations, setRelations] = useState<{ location_id: number; relation_type: FactionLocationRelationType }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listLocations(campaignId)
      .then((data) => {
        if (!cancelled) setLocations(data);
      })
      .catch(() => {
        // lista de localidades é opcional; vínculo pode ser feito depois
      });
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const duplicateRelationIndices = new Set(
    relations.flatMap((rel, i) =>
      relations.some((other, j) => j !== i && other.location_id === rel.location_id && other.relation_type === rel.relation_type)
        ? [i]
        : [],
    ),
  );

  const canSubmit =
    name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "" &&
    duplicateRelationIndices.size === 0;

  function addRelation() {
    if (locations.length === 0) return;
    setRelations((prev) => [...prev, { location_id: locations[0].id, relation_type: "presence" }]);
  }

  function updateRelation(index: number, patch: Partial<{ location_id: number; relation_type: FactionLocationRelationType }>) {
    setRelations((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function removeRelation(index: number) {
    setRelations((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createFaction(campaignId, {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        img_key: toSnakeCaseKey(name.trim()) || null,
        faction_type: factionType,
        faction_location_relation: relations,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a facção.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Nova facção" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__field">
          <label htmlFor="fac-name" className="manage-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="fac-name"
            type="text"
            className="manage-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="fac-tagline" className="manage-form__label">
              Tagline <span aria-hidden="true">*</span>
            </label>
            <input
              id="fac-tagline"
              type="text"
              className="manage-form__input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="fac-type" className="manage-form__label">
              Tipo <span aria-hidden="true">*</span>
            </label>
            <select
              id="fac-type"
              className="manage-form__select"
              value={factionType}
              onChange={(e) => setFactionType(e.target.value as FactionType)}
            >
              {FACTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="fac-desc" className="manage-form__label">
            Descrição <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="fac-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {locations.length > 0 ? (
          <>
            <h3 className="manage-form__section-label">Localizações vinculadas</h3>
            {relations.map((relation, index) => (
              <div className={`manage-form__row${duplicateRelationIndices.has(index) ? " manage-form__row--error" : ""}`} key={index}>
                <div className="manage-form__field">
                  <label htmlFor={`fac-rel-location-${index}`} className="manage-form__label">
                    Localização
                  </label>
                  <select
                    id={`fac-rel-location-${index}`}
                    className="manage-form__select"
                    value={relation.location_id}
                    onChange={(e) => updateRelation(index, { location_id: Number(e.target.value) })}
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="manage-form__field">
                  <label htmlFor={`fac-rel-type-${index}`} className="manage-form__label">
                    Relação
                  </label>
                  <div className="manage-form__relation-row">
                    <select
                      id={`fac-rel-type-${index}`}
                      className="manage-form__select"
                      value={relation.relation_type}
                      onChange={(e) => updateRelation(index, { relation_type: e.target.value as FactionLocationRelationType })}
                    >
                      {FACTION_LOCATION_RELATION_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <Button type="button" variant="ghost" onClick={() => removeRelation(index)}>
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {duplicateRelationIndices.size > 0 ? (
              <p className="manage-form__error">
                Vínculos duplicados: mesma localização com a mesma relação. Altere a relação ou remova o vínculo repetido.
              </p>
            ) : null}
            <Button type="button" variant="ghost" onClick={addRelation}>
              + Adicionar localização
            </Button>
          </>
        ) : null}

        <div className="manage-form__checkbox-field">
          <input
            id="fac-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="fac-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar facção"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
