import { useEffect } from "react";
import type { ReactNode } from "react";

import "../../pages/campaign-manage-page.css";

export type FormProps = { campaignId: number; onClose: () => void; onSuccess: () => void };

type FormModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function FormModal({ title, onClose, children }: FormModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="manage-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="manage-modal" role="dialog" aria-modal="true">
        <div className="manage-modal__header">
          <h2 className="manage-modal__title">{title}</h2>
          <button type="button" className="manage-modal__close" onClick={onClose} aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="manage-modal__body">{children}</div>
      </div>
    </div>
  );
}
