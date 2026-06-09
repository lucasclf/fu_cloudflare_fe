import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/components/button";
import { createCampaign } from "../api/create-campaign";
import "./create-campaign-form.css";

type CreateCampaignFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export function CreateCampaignForm({ onCreated, onCancel }: CreateCampaignFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createCampaign({ name: name.trim(), description: description.trim() || null });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a campanha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="create-campaign-form">
      <h2 className="create-campaign-form__title">Nova campanha</h2>

      {error ? <p className="create-campaign-form__error">{error}</p> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className="create-campaign-form__field">
          <label htmlFor="campaign-name" className="create-campaign-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="campaign-name"
            type="text"
            className="create-campaign-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            autoFocus
          />
        </div>

        <div className="create-campaign-form__field">
          <label htmlFor="campaign-description" className="create-campaign-form__label">
            Descrição
          </label>
          <textarea
            id="campaign-description"
            className="create-campaign-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="create-campaign-form__actions">
          <Button type="submit" variant="primary" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? "Criando..." : "Criar campanha"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
