import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import "./public-layout.css";

type PublicLayoutProps = {
  children?: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <main className="public-layout__main">{children ?? <Outlet />}</main>
    </div>
  );
}