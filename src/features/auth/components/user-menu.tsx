import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInitials } from "@/shared/lib/text-formatters";
import { useAuth } from "../hooks/use-auth";

import "./user-menu.css";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    navigate("/login", { replace: true });
  }

  function handleInvitations() {
    setIsOpen(false);
    navigate("/invitations");
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <span className="user-menu__name">{user.name}</span>
        <span className="user-menu__chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen ? (
        <div className="user-menu__dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            className="user-menu__item"
            onClick={handleInvitations}
          >
            Convites
          </button>
          <button
            type="button"
            role="menuitem"
            className="user-menu__item"
            onClick={handleLogout}
          >
            Deslogar
          </button>
        </div>
      ) : null}
    </div>
  );
}
