import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/components/button";
import { ImageUploadField } from "@/shared/components/image-upload-field";
import { createLocation } from "../../api/create-location";
import { useFormImageUpload } from "../../hooks/use-form-image-upload";
import type { LocationType } from "../../types/campaign";
import { FormModal, type FormProps } from "./form-modal";

const LOCATION_TYPE_OPTIONS: readonly { value: LocationType; label: string }[] = [
  { value: "region", label: "Região" },
  { value: "city", label: "Cidade" },
  { value: "village", label: "Vila" },
  { value: "dungeon", label: "Masmorra" },
  { value: "landmark", label: "Ponto de referência" },
  { value: "building", label: "Construção" },
  { value: "other", label: "Outro" },
];

export function LocationFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<LocationType>("other");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { imgUrl, uploading: uploadingImage, imageFieldProps } = useFormImageUpload(campaignId, "location");
  const canSubmit =
    name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "" && !uploadingImage;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createLocation(campaignId, {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        img_key: imgUrl,
        location_type: locationType,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o local.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Novo local" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__field">
          <label htmlFor="loc-name" className="manage-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="loc-name"
            type="text"
            className="manage-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="manage-form__field">
          <ImageUploadField
            id="loc-image"
            label="Imagem"
            {...imageFieldProps}
          />
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="loc-tagline" className="manage-form__label">
              Tagline <span aria-hidden="true">*</span>
            </label>
            <input
              id="loc-tagline"
              type="text"
              className="manage-form__input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="loc-type" className="manage-form__label">
              Tipo <span aria-hidden="true">*</span>
            </label>
            <select
              id="loc-type"
              className="manage-form__select"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
            >
              {LOCATION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="loc-desc" className="manage-form__label">
            Descrição <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="loc-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="manage-form__checkbox-field">
          <input
            id="loc-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="loc-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || uploadingImage || !canSubmit}>
            {submitting ? "Criando..." : "Criar local"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
