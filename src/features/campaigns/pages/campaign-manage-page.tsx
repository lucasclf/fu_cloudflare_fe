import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/shared/components/button";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { createSession } from "../api/create-session";
import { createNpc } from "../api/create-npc";
import { createPc } from "../api/create-pc";
import { createLocation } from "../api/create-location";
import { createFaction } from "../api/create-faction";
import { listLocations } from "../api/list-locations";
import { createMonster } from "../api/create-monster";
import { createItem } from "../api/create-item";
import type {
  AttributeDie,
  LocationType,
  FactionType,
  FactionLocationRelationType,
  LocationOption,
  MonsterType,
  ItemType,
  WeaponCategory,
  DamageType,
  NpcSpecialRuleType,
  NpcInventoryRelationType,
  CreateNpcInventoryItemInput,
  CreateNpcEquipmentInput,
} from "../types/campaign";
import { toSnakeCaseKey } from "@/shared/lib/text-formatters";
import { usePublicItems } from "@/features/items/hooks/use-public-items";
import "./campaign-manage-page.css";

type EntityType = "session" | "npc" | "pc" | "location" | "faction" | "monster" | "item";

const DICE_OPTIONS: readonly { value: AttributeDie; label: string }[] = [
  { value: "d6", label: "d6" },
  { value: "d8", label: "d8" },
  { value: "d10", label: "d10" },
  { value: "d12", label: "d12" },
];

const LOCATION_TYPE_OPTIONS: readonly { value: LocationType; label: string }[] = [
  { value: "region", label: "Região" },
  { value: "city", label: "Cidade" },
  { value: "village", label: "Vila" },
  { value: "dungeon", label: "Masmorra" },
  { value: "landmark", label: "Ponto de referência" },
  { value: "building", label: "Construção" },
  { value: "other", label: "Outro" },
];

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

const MONSTER_TYPE_OPTIONS: readonly { value: MonsterType; label: string }[] = [
  { value: "beast", label: "Besta" },
  { value: "construct", label: "Constructo" },
  { value: "demon", label: "Demônio" },
  { value: "elemental", label: "Elemental" },
  { value: "humanoid", label: "Humanoide" },
  { value: "monster", label: "Monstro" },
  { value: "plant", label: "Planta" },
  { value: "undead", label: "Morto-vivo" },
];

const ITEM_TYPE_OPTIONS: readonly { value: ItemType; label: string }[] = [
  { value: "arma", label: "Arma" },
  { value: "armadura", label: "Armadura" },
  { value: "escudo", label: "Escudo" },
  { value: "acessorio", label: "Acessório" },
  { value: "artefato", label: "Artefato" },
  { value: "outros", label: "Outros" },
];

const NPC_SPECIAL_RULE_TYPE_OPTIONS: readonly { value: NpcSpecialRuleType; label: string }[] = [
  { value: "bonus", label: "Bônus" },
  { value: "attack", label: "Ataque" },
  { value: "penalty", label: "Penalidade" },
  { value: "passive", label: "Passiva" },
  { value: "reaction", label: "Reação" },
  { value: "condition", label: "Condição" },
  { value: "note", label: "Nota" },
];

const NPC_INVENTORY_RELATION_TYPE_OPTIONS: readonly { value: NpcInventoryRelationType; label: string }[] = [
  { value: "inventory", label: "Inventário" },
  { value: "shop_stock", label: "Estoque de loja" },
];

const ATTRIBUTE_DIE_VALUE: Record<AttributeDie, number> = {
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
};

const WEAPON_CATEGORY_OPTIONS: readonly { value: WeaponCategory; label: string }[] = [
  { value: "arcana", label: "Arcana" },
  { value: "arco", label: "Arco" },
  { value: "luta", label: "Luta" },
  { value: "adaga", label: "Adaga" },
  { value: "arma_de_fogo", label: "Arma de fogo" },
  { value: "malho", label: "Malho" },
  { value: "pesado", label: "Pesado" },
  { value: "lança", label: "Lança" },
  { value: "espada", label: "Espada" },
  { value: "arremesso", label: "Arremesso" },
];

const DAMAGE_TYPE_OPTIONS: readonly { value: DamageType; label: string }[] = [
  { value: "physical", label: "Físico" },
  { value: "fire", label: "Fogo" },
  { value: "ice", label: "Gelo" },
  { value: "bolt", label: "Raio" },
  { value: "earth", label: "Terra" },
  { value: "air", label: "Ar" },
  { value: "light", label: "Luz" },
  { value: "dark", label: "Trevas" },
  { value: "poison", label: "Veneno" },
];

const GRIP_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "uma_mao", label: "Uma Mão" },
  { value: "duas_maos", label: "Duas Mãos" },
];

const DISTANCE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "corpo_a_corpo", label: "Corpo a corpo" },
  { value: "a_distancia", label: "À distância" },
];

const ATTRIBUTE_DIE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "", label: "—" },
  { value: "DES", label: "DES" },
  { value: "AST", label: "AST" },
  { value: "VIG", label: "VIG" },
  { value: "VON", label: "VON" },
];

function buildDiceFormula(dice: readonly string[], bonus: string): string | null {
  const selectedDice = dice.filter((d) => d !== "");
  const bonusValue = bonus.trim() === "" ? 0 : Number(bonus);

  if (selectedDice.length === 0 && bonusValue === 0) {
    return null;
  }

  const parts = [...selectedDice];
  if (bonusValue !== 0 || selectedDice.length === 0) {
    parts.push(bonusValue >= 0 ? `+${bonusValue}` : `${bonusValue}`);
  }

  return parts.join(" + ");
}

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

// ── Main page ─────────────────────────────────────────────────────────────────

export function CampaignManagePage() {
  const { data } = useCampaignHomeContext();
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

// ── Shared modal wrapper ──────────────────────────────────────────────────────

type FormModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function FormModal({ title, onClose, children }: FormModalProps) {
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

type FormProps = { campaignId: number; onClose: () => void; onSuccess: () => void };

// ── Session form ──────────────────────────────────────────────────────────────

function SessionFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [sessionNumber, setSessionNumber] = useState("");
  const [playedAt, setPlayedAt] = useState(today);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = sessionNumber !== "" && playedAt !== "" && summary.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createSession(campaignId, {
        session_number: Number(sessionNumber),
        played_at: playedAt,
        title: title.trim() || null,
        summary: summary.trim(),
        notes: notes.trim() || null,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a sessão.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Nova sessão" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="s-number" className="manage-form__label">
              Número <span aria-hidden="true">*</span>
            </label>
            <input
              id="s-number"
              type="number"
              className="manage-form__input"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              min={0}
              required
              autoFocus
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="s-date" className="manage-form__label">
              Data <span aria-hidden="true">*</span>
            </label>
            <input
              id="s-date"
              type="date"
              className="manage-form__input"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-title" className="manage-form__label">Título</label>
          <input
            id="s-title"
            type="text"
            className="manage-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-summary" className="manage-form__label">
            Resumo <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="s-summary"
            className="manage-form__textarea"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="s-notes" className="manage-form__label">Notas</label>
          <textarea
            id="s-notes"
            className="manage-form__textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="manage-form__checkbox-field">
          <input
            id="s-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="s-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar sessão"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

// ── NPC form ──────────────────────────────────────────────────────────────────

type NpcSpecialRuleDraft = {
  type: NpcSpecialRuleType;
  title: string;
  description: string;
  metadata: { key: string; value: string }[];
};

function NpcFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [level, setLevel] = useState("");
  const [dexDie, setDexDie] = useState<AttributeDie | "">("");
  const [insDie, setInsDie] = useState<AttributeDie | "">("");
  const [mgtDie, setMgtDie] = useState<AttributeDie | "">("");
  const [wilDie, setWilDie] = useState<AttributeDie | "">("");
  const [hp, setHp] = useState("");
  const [mp, setMp] = useState("");
  const [initiative, setInitiative] = useState("");
  const [defenseMode, setDefenseMode] = useState<"fixed" | "dex_bonus">("fixed");
  const [defense, setDefense] = useState("");
  const [defenseBonus, setDefenseBonus] = useState("");
  const [magicDefenseMode, setMagicDefenseMode] = useState<"fixed" | "ins_bonus">("fixed");
  const [magicDefense, setMagicDefense] = useState("");
  const [magicDefenseBonus, setMagicDefenseBonus] = useState("");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [inventory, setInventory] = useState<CreateNpcInventoryItemInput[]>([]);
  const [equipmentEnabled, setEquipmentEnabled] = useState(false);
  const [equipment, setEquipment] = useState<CreateNpcEquipmentInput>({
    main_hand: null,
    off_hand: null,
    armor: null,
    accessory: null,
  });
  const [specialRules, setSpecialRules] = useState<NpcSpecialRuleDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: items } = usePublicItems(true);
  const allItems = items ?? [];
  const mainHandOptions = allItems.filter((item) => item.itemType === "arma" || item.itemType === "escudo");
  const armorOptions = allItems.filter((item) => item.itemType === "armadura");
  const accessoryOptions = allItems.filter((item) => item.itemType === "acessorio");

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    inventory.every((i) => i.item_id > 0 && i.quantity >= 1) &&
    (!equipmentEnabled ||
      equipment.main_hand || equipment.off_hand || equipment.armor || equipment.accessory) &&
    specialRules.every((r) => r.title.trim() !== "" && r.description.trim() !== "");

  function parseDie(v: AttributeDie | ""): AttributeDie | null {
    return v === "" ? null : v;
  }

  function parseNum(v: string): number | null {
    const n = Number(v);
    return v.trim() === "" || isNaN(n) ? null : n;
  }

  function computeDieBonus(die: AttributeDie | "", bonus: string): number {
    const dieValue = die === "" ? 0 : ATTRIBUTE_DIE_VALUE[die];
    return dieValue + (parseNum(bonus) ?? 0);
  }

  function addInventoryItem() {
    if (allItems.length === 0) return;
    setInventory((prev) => [...prev, { item_id: allItems[0].id, relation_type: "inventory", quantity: 1 }]);
  }

  function updateInventoryItem(index: number, patch: Partial<CreateNpcInventoryItemInput>) {
    setInventory((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeInventoryItem(index: number) {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  }

  function addSpecialRule() {
    setSpecialRules((prev) => [...prev, { type: "note", title: "", description: "", metadata: [] }]);
  }

  function updateSpecialRule(index: number, patch: Partial<NpcSpecialRuleDraft>) {
    setSpecialRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));
  }

  function removeSpecialRule(index: number) {
    setSpecialRules((prev) => prev.filter((_, i) => i !== index));
  }

  function addMetadataEntry(ruleIndex: number) {
    setSpecialRules((prev) =>
      prev.map((rule, i) => (i === ruleIndex ? { ...rule, metadata: [...rule.metadata, { key: "", value: "" }] } : rule)),
    );
  }

  function updateMetadataEntry(ruleIndex: number, entryIndex: number, patch: Partial<{ key: string; value: string }>) {
    setSpecialRules((prev) =>
      prev.map((rule, i) =>
        i === ruleIndex
          ? { ...rule, metadata: rule.metadata.map((entry, j) => (j === entryIndex ? { ...entry, ...patch } : entry)) }
          : rule,
      ),
    );
  }

  function removeMetadataEntry(ruleIndex: number, entryIndex: number) {
    setSpecialRules((prev) =>
      prev.map((rule, i) =>
        i === ruleIndex ? { ...rule, metadata: rule.metadata.filter((_, j) => j !== entryIndex) } : rule,
      ),
    );
  }

  function toMetadataRecord(entries: { key: string; value: string }[]): Record<string, unknown> | null {
    const filtered = entries
      .filter((entry) => entry.key.trim() !== "")
      .map((entry) => [entry.key.trim(), entry.value] as const);
    return filtered.length > 0 ? Object.fromEntries(filtered) : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createNpc(campaignId, {
        name: name.trim(),
        description: description.trim(),
        tagline: tagline.trim() || null,
        level: parseNum(level),
        dexterity_die: parseDie(dexDie),
        insight_die: parseDie(insDie),
        might_die: parseDie(mgtDie),
        willpower_die: parseDie(wilDie),
        hp: parseNum(hp),
        mp: parseNum(mp),
        initiative: parseNum(initiative),
        defense: defenseMode === "dex_bonus" ? computeDieBonus(dexDie, defenseBonus) : parseNum(defense),
        magic_defense: magicDefenseMode === "ins_bonus" ? computeDieBonus(insDie, magicDefenseBonus) : parseNum(magicDefense),
        img_key: toSnakeCaseKey(name.trim()) || null,
        visible_to_players: visibleToPlayers,
        specialRules: specialRules.map((rule) => ({
          type: rule.type,
          title: rule.title.trim(),
          description: rule.description.trim(),
          metadata: toMetadataRecord(rule.metadata),
        })),
        inventory: inventory.map((item) => ({
          item_id: item.item_id,
          relation_type: item.relation_type,
          quantity: item.quantity,
        })),
        equipment: equipmentEnabled ? equipment : null,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o NPC.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Novo NPC" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__field">
          <label htmlFor="n-name" className="manage-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="n-name"
            type="text"
            className="manage-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="n-tagline" className="manage-form__label">Tagline</label>
          <input
            id="n-tagline"
            type="text"
            className="manage-form__input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="n-desc" className="manage-form__label">
            Descrição <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="n-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="n-level" className="manage-form__label">Nível</label>
          <input
            id="n-level"
            type="number"
            className="manage-form__input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            min={1}
          />
        </div>

        <p className="manage-form__section-label">Atributos</p>

        <div className="manage-form__dice-grid">
          {(
            [
              { id: "n-dex", label: "DES", value: dexDie, setter: setDexDie },
              { id: "n-ins", label: "INT", value: insDie, setter: setInsDie },
              { id: "n-mgt", label: "FOR", value: mgtDie, setter: setMgtDie },
              { id: "n-wil", label: "VON", value: wilDie, setter: setWilDie },
            ] as const
          ).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">{label}</label>
              <select
                id={id}
                className="manage-form__select"
                value={value}
                onChange={(e) => setter(e.target.value as AttributeDie | "")}
              >
                <option value="">—</option>
                {DICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <p className="manage-form__section-label">Combate</p>

        <div className="manage-form__numbers-grid-5">
          <div className="manage-form__field">
            <label htmlFor="n-hp" className="manage-form__label">PV</label>
            <input id="n-hp" type="number" className="manage-form__input" value={hp} onChange={(e) => setHp(e.target.value)} min={0} />
          </div>
          <div className="manage-form__field">
            <label htmlFor="n-mp" className="manage-form__label">PM</label>
            <input id="n-mp" type="number" className="manage-form__input" value={mp} onChange={(e) => setMp(e.target.value)} min={0} />
          </div>
          <div className="manage-form__field">
            <label htmlFor="n-ini" className="manage-form__label">INI</label>
            <input id="n-ini" type="number" className="manage-form__input" value={initiative} onChange={(e) => setInitiative(e.target.value)} min={0} />
          </div>
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="n-def-mode" className="manage-form__label">DEF</label>
            <select
              id="n-def-mode"
              className="manage-form__select"
              value={defenseMode}
              onChange={(e) => setDefenseMode(e.target.value as "fixed" | "dex_bonus")}
            >
              <option value="fixed">Valor fixo</option>
              <option value="dex_bonus">Destreza (DES) + bônus</option>
            </select>
          </div>
          {defenseMode === "fixed" ? (
            <div className="manage-form__field">
              <label htmlFor="n-def" className="manage-form__label">Valor</label>
              <input id="n-def" type="number" className="manage-form__input" value={defense} onChange={(e) => setDefense(e.target.value)} min={0} />
            </div>
          ) : (
            <div className="manage-form__field">
              <label htmlFor="n-def-bonus" className="manage-form__label">Bônus</label>
              <input id="n-def-bonus" type="number" className="manage-form__input" value={defenseBonus} onChange={(e) => setDefenseBonus(e.target.value)} />
            </div>
          )}
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="n-mdef-mode" className="manage-form__label">DEF. MÁGICA</label>
            <select
              id="n-mdef-mode"
              className="manage-form__select"
              value={magicDefenseMode}
              onChange={(e) => setMagicDefenseMode(e.target.value as "fixed" | "ins_bonus")}
            >
              <option value="fixed">Valor fixo</option>
              <option value="ins_bonus">Astúcia (AST) + bônus</option>
            </select>
          </div>
          {magicDefenseMode === "fixed" ? (
            <div className="manage-form__field">
              <label htmlFor="n-mdef" className="manage-form__label">Valor</label>
              <input id="n-mdef" type="number" className="manage-form__input" value={magicDefense} onChange={(e) => setMagicDefense(e.target.value)} min={0} />
            </div>
          ) : (
            <div className="manage-form__field">
              <label htmlFor="n-mdef-bonus" className="manage-form__label">Bônus</label>
              <input id="n-mdef-bonus" type="number" className="manage-form__input" value={magicDefenseBonus} onChange={(e) => setMagicDefenseBonus(e.target.value)} />
            </div>
          )}
        </div>

        {allItems.length > 0 ? (
          <>
            <h3 className="manage-form__section-label">Inventário</h3>
            {inventory.map((item, index) => (
              <div className="manage-form__row" key={index}>
                <div className="manage-form__field">
                  <label htmlFor={`n-inv-item-${index}`} className="manage-form__label">Item</label>
                  <select
                    id={`n-inv-item-${index}`}
                    className="manage-form__select"
                    value={item.item_id}
                    onChange={(e) => updateInventoryItem(index, { item_id: Number(e.target.value) })}
                  >
                    {allItems.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
                <div className="manage-form__field">
                  <label htmlFor={`n-inv-type-${index}`} className="manage-form__label">Relação / Quantidade</label>
                  <div className="manage-form__relation-row">
                    <select
                      id={`n-inv-type-${index}`}
                      className="manage-form__select"
                      value={item.relation_type}
                      onChange={(e) => updateInventoryItem(index, { relation_type: e.target.value as NpcInventoryRelationType })}
                    >
                      {NPC_INVENTORY_RELATION_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="manage-form__input"
                      style={{ width: "70px" }}
                      value={item.quantity}
                      onChange={(e) => updateInventoryItem(index, { quantity: Number(e.target.value) })}
                      min={1}
                    />
                    <Button type="button" variant="ghost" onClick={() => removeInventoryItem(index)}>
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={addInventoryItem}>
              + Adicionar item
            </Button>
          </>
        ) : null}

        <div className="manage-form__checkbox-field">
          <input
            id="n-equipment-enabled"
            type="checkbox"
            className="manage-form__checkbox"
            checked={equipmentEnabled}
            onChange={(e) => setEquipmentEnabled(e.target.checked)}
          />
          <label htmlFor="n-equipment-enabled" className="manage-form__checkbox-label">
            Incluir equipamento
          </label>
        </div>

        {equipmentEnabled ? (
          <>
            <h3 className="manage-form__section-label">Equipamento</h3>
            <div className="manage-form__dice-grid">
              <EquipmentSlotSelect
                id="n-eq-main-hand"
                label="Mão principal"
                options={mainHandOptions}
                value={equipment.main_hand ?? null}
                onChange={(value) => setEquipment((prev) => ({ ...prev, main_hand: value }))}
              />
              <EquipmentSlotSelect
                id="n-eq-off-hand"
                label="Mão secundária"
                options={mainHandOptions}
                value={equipment.off_hand ?? null}
                onChange={(value) => setEquipment((prev) => ({ ...prev, off_hand: value }))}
              />
              <EquipmentSlotSelect
                id="n-eq-armor"
                label="Armadura"
                options={armorOptions}
                value={equipment.armor ?? null}
                onChange={(value) => setEquipment((prev) => ({ ...prev, armor: value }))}
              />
              <EquipmentSlotSelect
                id="n-eq-accessory"
                label="Acessório"
                options={accessoryOptions}
                value={equipment.accessory ?? null}
                onChange={(value) => setEquipment((prev) => ({ ...prev, accessory: value }))}
              />
            </div>
          </>
        ) : null}

        <h3 className="manage-form__section-label">Regras especiais</h3>
        {specialRules.map((rule, index) => (
          <div key={index} className="manage-form__field" style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor={`n-rule-title-${index}`} className="manage-form__label">
                  Título <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`n-rule-title-${index}`}
                  type="text"
                  className="manage-form__input"
                  value={rule.title}
                  onChange={(e) => updateSpecialRule(index, { title: e.target.value })}
                  required
                />
              </div>
              <div className="manage-form__field">
                <label htmlFor={`n-rule-type-${index}`} className="manage-form__label">Tipo</label>
                <select
                  id={`n-rule-type-${index}`}
                  className="manage-form__select"
                  value={rule.type}
                  onChange={(e) => updateSpecialRule(index, { type: e.target.value as NpcSpecialRuleType })}
                >
                  {NPC_SPECIAL_RULE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="manage-form__field">
              <label htmlFor={`n-rule-desc-${index}`} className="manage-form__label">
                Descrição <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={`n-rule-desc-${index}`}
                className="manage-form__textarea"
                value={rule.description}
                onChange={(e) => updateSpecialRule(index, { description: e.target.value })}
                rows={2}
                required
              />
            </div>

            {rule.metadata.map((entry, entryIndex) => (
              <div className="manage-form__relation-row" key={entryIndex}>
                <input
                  type="text"
                  className="manage-form__input"
                  placeholder="Chave"
                  value={entry.key}
                  onChange={(e) => updateMetadataEntry(index, entryIndex, { key: e.target.value })}
                />
                <input
                  type="text"
                  className="manage-form__input"
                  placeholder="Valor"
                  value={entry.value}
                  onChange={(e) => updateMetadataEntry(index, entryIndex, { value: e.target.value })}
                />
                <Button type="button" variant="ghost" onClick={() => removeMetadataEntry(index, entryIndex)}>
                  Remover
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => addMetadataEntry(index)}>
              + Adicionar metadado
            </Button>

            <div className="manage-form__actions">
              <Button type="button" variant="ghost" onClick={() => removeSpecialRule(index)}>
                Remover regra
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addSpecialRule}>
          + Adicionar regra especial
        </Button>

        <div className="manage-form__checkbox-field">
          <input
            id="n-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="n-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar NPC"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

function EquipmentSlotSelect({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { id: number; name: string }[];
  value: number | null;
  onChange: (value: number | null) => void;
}) {
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

// ── PC form ───────────────────────────────────────────────────────────────────

function PcFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [origin, setOrigin] = useState("");
  const [identity, setIdentity] = useState("");
  const [theme, setTheme] = useState("");
  const [money, setMoney] = useState("0");
  const [dexDie, setDexDie] = useState<AttributeDie>("d8");
  const [insDie, setInsDie] = useState<AttributeDie>("d8");
  const [mgtDie, setMgtDie] = useState<AttributeDie>("d8");
  const [wilDie, setWilDie] = useState<AttributeDie>("d8");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    origin.trim() !== "" &&
    identity.trim() !== "" &&
    theme.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createPc(campaignId, {
        name: name.trim(),
        description: description.trim(),
        tagline: tagline.trim() || null,
        pronouns: pronouns.trim() || null,
        origin: origin.trim(),
        identity: identity.trim(),
        theme: theme.trim(),
        money: money.trim() === "" ? 0 : Number(money),
        dexterity_die: dexDie,
        insight_die: insDie,
        might_die: mgtDie,
        willpower_die: wilDie,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o personagem.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Novo personagem (PC)" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="pc-name" className="manage-form__label">
              Nome <span aria-hidden="true">*</span>
            </label>
            <input
              id="pc-name"
              type="text"
              className="manage-form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="pc-pronouns" className="manage-form__label">Pronomes</label>
            <input
              id="pc-pronouns"
              type="text"
              className="manage-form__input"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="ex.: ele/dele"
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-tagline" className="manage-form__label">Tagline</label>
          <input
            id="pc-tagline"
            type="text"
            className="manage-form__input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-desc" className="manage-form__label">
            Descrição <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="pc-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="pc-origin" className="manage-form__label">
              Origem <span aria-hidden="true">*</span>
            </label>
            <input
              id="pc-origin"
              type="text"
              className="manage-form__input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
          <div className="manage-form__field">
            <label htmlFor="pc-money" className="manage-form__label">Zeni</label>
            <input
              id="pc-money"
              type="number"
              className="manage-form__input"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-identity" className="manage-form__label">
            Identidade <span aria-hidden="true">*</span>
          </label>
          <input
            id="pc-identity"
            type="text"
            className="manage-form__input"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            required
          />
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-theme" className="manage-form__label">
            Tema <span aria-hidden="true">*</span>
          </label>
          <input
            id="pc-theme"
            type="text"
            className="manage-form__input"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
          />
        </div>

        <p className="manage-form__section-label">Atributos base</p>

        <div className="manage-form__dice-grid">
          {(
            [
              { id: "pc-dex", label: "DES", value: dexDie, setter: setDexDie },
              { id: "pc-ins", label: "INT", value: insDie, setter: setInsDie },
              { id: "pc-mgt", label: "FOR", value: mgtDie, setter: setMgtDie },
              { id: "pc-wil", label: "VON", value: wilDie, setter: setWilDie },
            ] as const
          ).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">{label}</label>
              <select
                id={id}
                className="manage-form__select"
                value={value}
                onChange={(e) => setter(e.target.value as AttributeDie)}
              >
                {DICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar personagem"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

// ── Location form ─────────────────────────────────────────────────────────────

function LocationFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<LocationType>("other");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "";

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
        img_key: toSnakeCaseKey(name.trim()) || null,
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
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
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

// ── Faction form ──────────────────────────────────────────────────────────────

function FactionFormModal({ campaignId, onClose, onSuccess }: FormProps) {
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

  const canSubmit =
    name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "";

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
              <div className="manage-form__row" key={index}>
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

// ── Monster form ──────────────────────────────────────────────────────────────

function MonsterFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monsterType, setMonsterType] = useState<MonsterType>("beast");
  const [level, setLevel] = useState("1");
  const [dexDie, setDexDie] = useState<AttributeDie>("d8");
  const [insDie, setInsDie] = useState<AttributeDie>("d8");
  const [mgtDie, setMgtDie] = useState<AttributeDie>("d8");
  const [wilDie, setWilDie] = useState<AttributeDie>("d8");
  const [hp, setHp] = useState("");
  const [mp, setMp] = useState("");
  const [initiative, setInitiative] = useState("");
  const [defense, setDefense] = useState("");
  const [magicDefense, setMagicDefense] = useState("");
  const [isVillain, setIsVillain] = useState(false);
  const [ultimaPoints, setUltimaPoints] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    level !== "" &&
    hp !== "" &&
    mp !== "" &&
    initiative !== "" &&
    defense !== "" &&
    magicDefense !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createMonster(campaignId, {
        name: name.trim(),
        description: description.trim(),
        monster_type: monsterType,
        level: Number(level),
        dexterity_die: dexDie,
        insight_die: insDie,
        might_die: mgtDie,
        willpower_die: wilDie,
        hp: Number(hp),
        mp: Number(mp),
        initiative: Number(initiative),
        defense: Number(defense),
        magic_defense: Number(magicDefense),
        is_villain: isVillain,
        ultima_points: isVillain ? Number(ultimaPoints) : 0,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o monstro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Novo monstro" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__field">
          <label htmlFor="mo-name" className="manage-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="mo-name"
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
            <label htmlFor="mo-type" className="manage-form__label">
              Tipo <span aria-hidden="true">*</span>
            </label>
            <select
              id="mo-type"
              className="manage-form__select"
              value={monsterType}
              onChange={(e) => setMonsterType(e.target.value as MonsterType)}
            >
              {MONSTER_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="manage-form__field">
            <label htmlFor="mo-level" className="manage-form__label">
              Nível <span aria-hidden="true">*</span>
            </label>
            <input
              id="mo-level"
              type="number"
              className="manage-form__input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              min={1}
              required
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="mo-desc" className="manage-form__label">
            Descrição <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="mo-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <p className="manage-form__section-label">Atributos</p>

        <div className="manage-form__dice-grid">
          {(
            [
              { id: "mo-dex", label: "DES", value: dexDie, setter: setDexDie },
              { id: "mo-ins", label: "INT", value: insDie, setter: setInsDie },
              { id: "mo-mgt", label: "FOR", value: mgtDie, setter: setMgtDie },
              { id: "mo-wil", label: "VON", value: wilDie, setter: setWilDie },
            ] as const
          ).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">{label}</label>
              <select
                id={id}
                className="manage-form__select"
                value={value}
                onChange={(e) => setter(e.target.value as AttributeDie)}
              >
                {DICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <p className="manage-form__section-label">Combate</p>

        <div className="manage-form__numbers-grid-5">
          {(
            [
              { id: "mo-hp", label: "PV", value: hp, setter: setHp },
              { id: "mo-mp", label: "PM", value: mp, setter: setMp },
              { id: "mo-ini", label: "INI", value: initiative, setter: setInitiative },
              { id: "mo-def", label: "DEF", value: defense, setter: setDefense },
              { id: "mo-mdef", label: "M.DEF", value: magicDefense, setter: setMagicDefense },
            ] as const
          ).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">
                {label} <span aria-hidden="true">*</span>
              </label>
              <input
                id={id}
                type="number"
                className="manage-form__input"
                value={value}
                onChange={(e) => setter(e.target.value)}
                min={0}
                required
              />
            </div>
          ))}
        </div>

        <label className="manage-form__checkbox-field">
          <input
            type="checkbox"
            className="manage-form__checkbox"
            checked={isVillain}
            onChange={(e) => setIsVillain(e.target.checked)}
          />
          <span className="manage-form__checkbox-label">Vilão (Boss)</span>
        </label>

        {isVillain ? (
          <div className="manage-form__field">
            <label htmlFor="mo-up" className="manage-form__label">Pontos Ultima</label>
            <input
              id="mo-up"
              type="number"
              className="manage-form__input"
              value={ultimaPoints}
              onChange={(e) => setUltimaPoints(e.target.value)}
              min={0}
            />
          </div>
        ) : null}

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar monstro"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}

// ── Item form ─────────────────────────────────────────────────────────────────

function ItemFormModal({ campaignId, onClose, onSuccess }: FormProps) {
  const [name, setName] = useState("");
  const [itemType, setItemType] = useState<ItemType>("outros");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [isMartial, setIsMartial] = useState(false);

  const [weaponCategory, setWeaponCategory] = useState<WeaponCategory>("espada");
  const [accuracyDie1, setAccuracyDie1] = useState("");
  const [accuracyDie2, setAccuracyDie2] = useState("");
  const [accuracyBonus, setAccuracyBonus] = useState("");
  const [damage, setDamage] = useState("");
  const [damageType, setDamageType] = useState<DamageType>("physical");
  const [grip, setGrip] = useState("uma_mao");
  const [distance, setDistance] = useState("corpo_a_corpo");

  const [defenseDice, setDefenseDice] = useState("");
  const [defenseBonus, setDefenseBonus] = useState("");
  const [magicDefenseDice, setMagicDefenseDice] = useState("");
  const [magicDefenseBonus, setMagicDefenseBonus] = useState("");
  const [initiative, setInitiative] = useState("");

  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() !== "";
  const imgKey = name.trim() ? toSnakeCaseKey(name) : "";
  const isWeapon = itemType === "arma";
  const hasDefenseFields = itemType === "arma" || itemType === "armadura" || itemType === "escudo";
  const canBeMartial = itemType === "arma" || itemType === "armadura" || itemType === "escudo";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await createItem(campaignId, {
        name: name.trim(),
        item_type: itemType,
        description: description.trim() || null,
        img_key: imgKey || null,
        cost: cost.trim() === "" ? null : Number(cost),
        weapon_category: isWeapon ? weaponCategory : null,
        accuracy: isWeapon ? buildDiceFormula([accuracyDie1, accuracyDie2], accuracyBonus) : null,
        damage: isWeapon ? (damage.trim() || null) : null,
        damage_type: isWeapon ? damageType : null,
        grip: isWeapon ? grip : null,
        distance: isWeapon ? distance : null,
        defense_dice: hasDefenseFields ? buildDiceFormula([defenseDice], defenseBonus) : null,
        defense_bonus: null,
        magic_defense_dice: hasDefenseFields ? buildDiceFormula([magicDefenseDice], magicDefenseBonus) : null,
        magic_defense_bonus: null,
        initiative: hasDefenseFields ? (initiative.trim() || null) : null,
        is_martial: canBeMartial ? isMartial : false,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title="Novo item" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {error ? <p className="manage-form__error">{error}</p> : null}

        <div className="manage-form__field">
          <label htmlFor="it-name" className="manage-form__label">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="it-name"
            type="text"
            className="manage-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          {imgKey ? <p className="manage-form__hint">Chave de imagem: {imgKey}</p> : null}
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="it-type" className="manage-form__label">
              Tipo <span aria-hidden="true">*</span>
            </label>
            <select
              id="it-type"
              className="manage-form__select"
              value={itemType}
              onChange={(e) => setItemType(e.target.value as ItemType)}
            >
              {ITEM_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="manage-form__field">
            <label htmlFor="it-cost" className="manage-form__label">Custo (Zeni)</label>
            <input
              id="it-cost"
              type="number"
              className="manage-form__input"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="it-desc" className="manage-form__label">Descrição</label>
          <textarea
            id="it-desc"
            className="manage-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {canBeMartial ? (
          <div className="manage-form__checkbox-field">
            <input
              id="it-martial"
              type="checkbox"
              className="manage-form__checkbox"
              checked={isMartial}
              onChange={(e) => setIsMartial(e.target.checked)}
            />
            <label htmlFor="it-martial" className="manage-form__checkbox-label">
              Item marcial
            </label>
          </div>
        ) : null}

        {isWeapon ? (
          <>
            <p className="manage-form__section-label">Arma</p>

            <div className="manage-form__field">
              <label htmlFor="it-weapon-category" className="manage-form__label">Categoria</label>
              <select
                id="it-weapon-category"
                className="manage-form__select"
                value={weaponCategory}
                onChange={(e) => setWeaponCategory(e.target.value as WeaponCategory)}
              >
                {WEAPON_CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="manage-form__field">
              <label className="manage-form__label">Precisão</label>
              <div className="manage-form__numbers-grid">
                <select
                  aria-label="Primeiro dado de precisão"
                  className="manage-form__select"
                  value={accuracyDie1}
                  onChange={(e) => setAccuracyDie1(e.target.value)}
                >
                  {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <select
                  aria-label="Segundo dado de precisão"
                  className="manage-form__select"
                  value={accuracyDie2}
                  onChange={(e) => setAccuracyDie2(e.target.value)}
                >
                  {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  aria-label="Bônus de precisão"
                  type="number"
                  className="manage-form__input"
                  value={accuracyBonus}
                  onChange={(e) => setAccuracyBonus(e.target.value)}
                  placeholder="Bônus"
                />
              </div>
            </div>

            <div className="manage-form__field">
              <label htmlFor="it-damage" className="manage-form__label">Dano</label>
              <input
                id="it-damage"
                type="text"
                className="manage-form__input"
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
              />
            </div>

            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor="it-damage-type" className="manage-form__label">Tipo de dano</label>
                <select
                  id="it-damage-type"
                  className="manage-form__select"
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value as DamageType)}
                >
                  {DAMAGE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="manage-form__field">
                <label htmlFor="it-grip" className="manage-form__label">Empunhadura</label>
                <select
                  id="it-grip"
                  className="manage-form__select"
                  value={grip}
                  onChange={(e) => setGrip(e.target.value)}
                >
                  {GRIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="manage-form__field">
              <label htmlFor="it-distance" className="manage-form__label">Alcance</label>
              <select
                id="it-distance"
                className="manage-form__select"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              >
                {DISTANCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {hasDefenseFields ? (
          <>
            <p className="manage-form__section-label">Defesa</p>

            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor="it-defense-dice" className="manage-form__label">Dado de defesa</label>
                <select
                  id="it-defense-dice"
                  className="manage-form__select"
                  value={defenseDice}
                  onChange={(e) => setDefenseDice(e.target.value)}
                >
                  {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="manage-form__field">
                <label htmlFor="it-defense-bonus" className="manage-form__label">Bônus de defesa</label>
                <input
                  id="it-defense-bonus"
                  type="number"
                  className="manage-form__input"
                  value={defenseBonus}
                  onChange={(e) => setDefenseBonus(e.target.value)}
                />
              </div>
            </div>

            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor="it-magic-defense-dice" className="manage-form__label">Dado de defesa mágica</label>
                <select
                  id="it-magic-defense-dice"
                  className="manage-form__select"
                  value={magicDefenseDice}
                  onChange={(e) => setMagicDefenseDice(e.target.value)}
                >
                  {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="manage-form__field">
                <label htmlFor="it-magic-defense-bonus" className="manage-form__label">Bônus de defesa mágica</label>
                <input
                  id="it-magic-defense-bonus"
                  type="number"
                  className="manage-form__input"
                  value={magicDefenseBonus}
                  onChange={(e) => setMagicDefenseBonus(e.target.value)}
                />
              </div>
            </div>

            <div className="manage-form__field">
              <label htmlFor="it-initiative" className="manage-form__label">Iniciativa</label>
              <input
                id="it-initiative"
                type="text"
                className="manage-form__input"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
              />
            </div>
          </>
        ) : null}

        <div className="manage-form__checkbox-field">
          <input
            id="it-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="it-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
            {submitting ? "Criando..." : "Criar item"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
