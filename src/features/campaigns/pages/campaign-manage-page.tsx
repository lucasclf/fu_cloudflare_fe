import { useState } from "react";
import type { ReactNode } from "react";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { SessionFormModal } from "../components/manage-forms/session-form-modal";
import { NpcFormModal } from "../components/manage-forms/npc-form-modal";
import { PcFormModal } from "../components/manage-forms/pc-form-modal";
import { LocationFormModal } from "../components/manage-forms/location-form-modal";
import { FactionFormModal } from "../components/manage-forms/faction-form-modal";
import { MonsterFormModal } from "../components/manage-forms/monster-form-modal";
import { ItemFormModal } from "../components/manage-forms/item-form-modal";
import "./campaign-manage-page.css";

type EntityType = "session" | "npc" | "pc" | "location" | "faction" | "monster" | "item";

type TileConfig = {
  type: EntityType;
  label: string;
  description: string;
  icon: ReactNode;
};

const MASTER_TILES: TileConfig[] = [
  {
    type: "session",
    label: "Sessão",
    description: "Registre uma sessão de jogo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    type: "npc",
    label: "NPC",
    description: "Adicione um personagem não-jogador",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    type: "pc",
    label: "Personagem",
    description: "Crie um personagem jogador",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    type: "location",
    label: "Local",
    description: "Mapeie um lugar do mundo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    type: "faction",
    label: "Facção",
    description: "Registre um grupo ou organização",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    type: "monster",
    label: "Monstro",
    description: "Adicione uma criatura ao bestiário",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    type: "item",
    label: "Item",
    description: "Crie um equipamento ou artefato",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
];

const PLAYER_TILES: TileConfig[] = [MASTER_TILES[2]];

export function CampaignManagePage() {
  const { data, campaignId: id } = useCampaignHomeContext();
  const [activeForm, setActiveForm] = useState<EntityType | null>(null);

  const isMaster = data.role === "master";
  const tiles = isMaster ? MASTER_TILES : PLAYER_TILES;

  function handleClose() {
    setActiveForm(null);
  }

  function handleSuccess() {
    setActiveForm(null);
  }

  return (
    <div className="campaign-manage">
      <header className="campaign-manage__header">
        <h1 className="campaign-manage__title">Administração</h1>
        <p className="campaign-manage__subtitle">{data.campaign.name}</p>
      </header>

      <p className="campaign-manage__section-label">
        {isMaster ? "Criar novo" : "Meu personagem"}
      </p>

      <div className="campaign-manage__tiles">
        {tiles.map((tile) => (
          <button
            key={tile.type}
            type="button"
            className="campaign-manage__tile"
            onClick={() => setActiveForm(tile.type)}
          >
            <span className="campaign-manage__tile-icon">{tile.icon}</span>
            <span className="campaign-manage__tile-label">{tile.label}</span>
            <span className="campaign-manage__tile-desc">{tile.description}</span>
          </button>
        ))}
      </div>

      {activeForm === "session" && (
        <SessionFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "npc" && (
        <NpcFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "pc" && (
        <PcFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "location" && (
        <LocationFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "faction" && (
        <FactionFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "monster" && (
        <MonsterFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
      {activeForm === "item" && (
        <ItemFormModal campaignId={id} onClose={handleClose} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
