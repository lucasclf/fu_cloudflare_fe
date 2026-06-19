import { useState } from "react";
import type { ChangeEvent } from "react";

import { isExternalImageUrl } from "@/shared/lib/is-external-image-url";

import "./image-upload-field.css";

const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

type ImageUploadFieldProps = {
  id: string;
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadFile: (file: File) => Promise<string>;
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
  acceptedTypes?: readonly string[];
  maxFileSizeBytes?: number;
};

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  onUploadFile,
  uploading,
  onUploadingChange,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
}: ImageUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!acceptedTypes.includes(file.type)) {
      setError("Formato não suportado. Use PNG, JPEG ou WebP.");
      return;
    }

    if (file.size > maxFileSizeBytes) {
      setError(`Arquivo muito grande. O limite é ${Math.round(maxFileSizeBytes / (1024 * 1024))}MB.`);
      return;
    }

    onUploadingChange(true);
    try {
      const url = await onUploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      onUploadingChange(false);
    }
  }

  return (
    <div className="image-upload-field">
      <label htmlFor={id} className="image-upload-field__label">{label}</label>

      <div className="image-upload-field__row">
        {isExternalImageUrl(value) ? (
          <img
            src={value as string}
            alt="Pré-visualização da imagem selecionada"
            className="image-upload-field__preview"
          />
        ) : null}

        <input
          id={id}
          type="file"
          accept={acceptedTypes.join(",")}
          className="image-upload-field__input"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {uploading ? <p className="image-upload-field__hint">Enviando imagem…</p> : null}
      {!uploading && value && !isExternalImageUrl(value) ? (
        <p className="image-upload-field__hint">
          Imagem gerada automaticamente — envie um arquivo para substituir.
        </p>
      ) : null}
      {error ? <p className="image-upload-field__error">{error}</p> : null}
    </div>
  );
}
