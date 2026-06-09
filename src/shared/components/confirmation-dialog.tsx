import { useEffect, useRef } from "react";
import { Button } from "./button";
import "./confirmation-dialog.css";

type ConfirmationDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export function ConfirmationDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  isLoading = false,
  error,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, isLoading]);

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!isLoading && event.target === event.currentTarget) {
      onCancel();
    }
  }

  return (
    <div className="confirmation-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-dialog" role="dialog" aria-modal="true" ref={dialogRef}>
        <h2 className="confirmation-dialog__title">{title}</h2>
        <p className="confirmation-dialog__message">{message}</p>

        {error ? (
          <p className="confirmation-dialog__error">{error}</p>
        ) : null}

        <div className="confirmation-dialog__actions">
          <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Aguarde..." : confirmLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
