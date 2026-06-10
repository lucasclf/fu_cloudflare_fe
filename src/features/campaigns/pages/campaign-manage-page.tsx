import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { Button } from "@/shared/components/button";
import { useCampaignHome } from "../hooks/use-campaign-home";
import { createSession } from "../api/create-session";
import { createNpc } from "../api/create-npc";
import { createPc } from "../api/create-pc";
import { createLocation } from "../api/create-location";
import { createFaction } from "../api/create-faction";
import { createMonster } from "../api/create-monster";
import { createItem } from "../api/create-item";
import type {
  AttributeDie,
  LocationType,
  FactionType,
  MonsterType,
  ItemType,
  WeaponCategory,
  DamageType,
} from "../types/campaign";
import { toSnakeCaseKey } from "@/shared/lib/text-formatters";
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
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const id = Number(campaignId);
  const { data, loading, error } = useCampaignHome(id);
  const [activeForm, setActiveForm] = useState<EntityType | null>(null);

  if (loading) return <LoadingState />;
  if (error || !data)
    return <ErrorState message={error ?? "Não foi possível carregar a campanha."} />;

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
        <button
          type="button"
          className="campaign-manage__back"
          onClick={() => navigate(`/campaigns/${id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Campanha
        </button>
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
  const [defense, setDefense] = useState("");
  const [magicDefense, setMagicDefense] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() !== "" && description.trim() !== "";

  function parseDie(v: AttributeDie | ""): AttributeDie | null {
    return v === "" ? null : v;
  }

  function parseNum(v: string): number | null {
    const n = Number(v);
    return v.trim() === "" || isNaN(n) ? null : n;
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
        defense: parseNum(defense),
        magic_defense: parseNum(magicDefense),
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
          {(
            [
              { id: "n-hp", label: "PV", value: hp, setter: setHp },
              { id: "n-mp", label: "PM", value: mp, setter: setMp },
              { id: "n-ini", label: "INI", value: initiative, setter: setInitiative },
              { id: "n-def", label: "DEF", value: defense, setter: setDefense },
              { id: "n-mdef", label: "M.DEF", value: magicDefense, setter: setMagicDefense },
            ] as const
          ).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">{label}</label>
              <input
                id={id}
                type="number"
                className="manage-form__input"
                value={value}
                onChange={(e) => setter(e.target.value)}
                min={0}
              />
            </div>
          ))}
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
        location_type: locationType,
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
      await createFaction(campaignId, {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        faction_type: factionType,
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
