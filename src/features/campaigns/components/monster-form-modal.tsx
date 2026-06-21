import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/shared/components/button";
import { ImageUploadField } from "@/shared/components/image-upload-field";
import { createMonster } from "../api/create-monster";
import { updateMonster } from "../api/update-monster";
import { useFormImageUpload } from "../hooks/use-form-image-upload";
import type {
  AttributeDie,
  MonsterType,
  MonsterAffinityType,
  MonsterActionType,
  MonsterActionIcon,
  CreateMonsterAffinitiesInput,
  CreateMonsterActionInput,
  DamageType,
} from "../types/campaign";
import type { MonsterDetail } from "@/features/monsters/types/monster";

const DICE_OPTIONS: readonly { value: AttributeDie; label: string }[] = [
  { value: "d6", label: "d6" },
  { value: "d8", label: "d8" },
  { value: "d10", label: "d10" },
  { value: "d12", label: "d12" },
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

const AFFINITY_TYPE_OPTIONS: readonly { value: MonsterAffinityType; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "vulnerable", label: "Vulnerável" },
  { value: "resistant", label: "Resistente" },
  { value: "immune", label: "Imune" },
  { value: "absorbs", label: "Absorve" },
];

const ACTION_TYPE_OPTIONS: readonly { value: MonsterActionType; label: string }[] = [
  { value: "basic_attack", label: "Ataque básico" },
  { value: "spell", label: "Magia" },
  { value: "other_action", label: "Outra ação" },
  { value: "special_rule", label: "Regra especial" },
];

const ACTION_ICON_OPTIONS: readonly { value: MonsterActionIcon; label: string }[] = [
  { value: "melee", label: "Corpo a corpo" },
  { value: "ranged", label: "À distância" },
  { value: "spell", label: "Magia" },
  { value: "support", label: "Suporte" },
  { value: "passive", label: "Passiva" },
];

const ACTION_ICON_OPTIONS_BY_TYPE: Record<MonsterActionType, readonly { value: MonsterActionIcon; label: string }[]> = {
  spell: ACTION_ICON_OPTIONS.filter((o) => o.value === "spell"),
  basic_attack: ACTION_ICON_OPTIONS.filter((o) => o.value === "melee" || o.value === "ranged"),
  special_rule: ACTION_ICON_OPTIONS.filter((o) => o.value === "support" || o.value === "passive"),
  other_action: ACTION_ICON_OPTIONS,
};

type MonsterActionFieldVisibility = {
  damageType: boolean;
  checkFormula: boolean;
  accuracyBonus: boolean;
  cost: boolean;
  target: boolean;
  duration: boolean;
  isOffensive: boolean;
};

const ACTION_FIELD_VISIBILITY: Record<MonsterActionType, MonsterActionFieldVisibility> = {
  special_rule: {
    damageType: false, checkFormula: false, accuracyBonus: false,
    cost: false, target: false, duration: false, isOffensive: false,
  },
  basic_attack: {
    damageType: true, checkFormula: true, accuracyBonus: true,
    cost: false, target: false, duration: false, isOffensive: true,
  },
  spell: {
    damageType: true, checkFormula: true, accuracyBonus: true,
    cost: true, target: true, duration: true, isOffensive: true,
  },
  other_action: {
    damageType: true, checkFormula: true, accuracyBonus: true,
    cost: true, target: true, duration: true, isOffensive: true,
  },
};

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

type MonsterActionFormState = Omit<CreateMonsterActionInput, "check_formula"> & {
  check_die1: string;
  check_die2: string;
};

const DEFAULT_MONSTER_AFFINITIES: CreateMonsterAffinitiesInput = {
  physical: "normal",
  air: "normal",
  bolt: "normal",
  dark: "normal",
  earth: "normal",
  fire: "normal",
  ice: "normal",
  light: "normal",
  poison: "normal",
};

function createEmptyMonsterAction(): MonsterActionFormState {
  return {
    action_type: "basic_attack",
    action_icon: null,
    name: "",
    description: "",
    check_die1: "",
    check_die2: "",
    accuracy_bonus: null,
    damage_type: null,
    cost: null,
    target: null,
    duration: null,
    is_offensive: false,
  };
}

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

type MonsterFormModalProps = {
  campaignId: number;
  onClose: () => void;
  onSuccess: () => void;
  initialMonster?: MonsterDetail;
  monsterId?: number;
};

export function MonsterFormModal({
  campaignId,
  onClose,
  onSuccess,
  initialMonster,
  monsterId,
}: MonsterFormModalProps) {
  const [name, setName] = useState(initialMonster?.name ?? "");
  const [description, setDescription] = useState(initialMonster?.description ?? "");
  const [monsterType, setMonsterType] = useState<MonsterType>(
    (initialMonster?.monster_type as MonsterType | undefined) ?? "beast",
  );
  const [level, setLevel] = useState(
    initialMonster?.level != null ? String(initialMonster.level) : "1",
  );
  const [dexDie, setDexDie] = useState<AttributeDie>(
    (initialMonster?.dexterity_die as AttributeDie | undefined) ?? "d8",
  );
  const [insDie, setInsDie] = useState<AttributeDie>(
    (initialMonster?.insight_die as AttributeDie | undefined) ?? "d8",
  );
  const [mgtDie, setMgtDie] = useState<AttributeDie>(
    (initialMonster?.might_die as AttributeDie | undefined) ?? "d8",
  );
  const [wilDie, setWilDie] = useState<AttributeDie>(
    (initialMonster?.willpower_die as AttributeDie | undefined) ?? "d8",
  );
  const [hp, setHp] = useState(
    initialMonster?.hp != null ? String(initialMonster.hp) : "",
  );
  const [mp, setMp] = useState(
    initialMonster?.mp != null ? String(initialMonster.mp) : "",
  );
  const [initiative, setInitiative] = useState(
    initialMonster?.initiative != null ? String(initialMonster.initiative) : "",
  );
  const [defense, setDefense] = useState(
    initialMonster?.defense != null ? String(initialMonster.defense) : "",
  );
  const [magicDefense, setMagicDefense] = useState(
    initialMonster?.magic_defense != null ? String(initialMonster.magic_defense) : "",
  );
  const [isVillain, setIsVillain] = useState(!!initialMonster?.is_villain);
  const [ultimaPoints, setUltimaPoints] = useState(
    initialMonster?.ultima_points != null ? String(initialMonster.ultima_points) : "0",
  );
  const [traits, setTraits] = useState<string[]>(
    initialMonster?.traits.map((t) => t.trait) ?? [],
  );
  const [affinities, setAffinities] = useState<CreateMonsterAffinitiesInput>(() => {
    if (!initialMonster?.affinities?.length) return DEFAULT_MONSTER_AFFINITIES;
    const a = initialMonster.affinities[0];
    return {
      physical: (a.physical as MonsterAffinityType | null) ?? "normal",
      air: (a.air as MonsterAffinityType | null) ?? "normal",
      bolt: (a.bolt as MonsterAffinityType | null) ?? "normal",
      dark: (a.dark as MonsterAffinityType | null) ?? "normal",
      earth: (a.earth as MonsterAffinityType | null) ?? "normal",
      fire: (a.fire as MonsterAffinityType | null) ?? "normal",
      ice: (a.ice as MonsterAffinityType | null) ?? "normal",
      light: (a.light as MonsterAffinityType | null) ?? "normal",
      poison: (a.poison as MonsterAffinityType | null) ?? "normal",
    };
  });
  const [actions, setActions] = useState<MonsterActionFormState[]>(
    initialMonster?.actions.map((a) => ({
      action_type: a.action_type as MonsterActionType,
      action_icon: (a.action_icon as MonsterActionIcon | null) ?? null,
      name: a.name,
      description: a.description,
      check_die1: "",
      check_die2: "",
      accuracy_bonus: a.accuracy_bonus ?? null,
      damage_type: (a.damage_type as DamageType | null) ?? null,
      cost: a.cost ?? null,
      target: a.target ?? null,
      duration: a.duration ?? null,
      is_offensive: !!(a.is_offensive === true || a.is_offensive === 1 || a.is_offensive === "1"),
    })) ?? [],
  );
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { imgUrl, uploading: uploadingImage, imageFieldProps } = useFormImageUpload(campaignId, "monster", initialMonster?.img_key ?? null);

  function addTrait() {
    setTraits((prev) => (prev.length >= 4 ? prev : [...prev, ""]));
  }

  function updateTrait(index: number, value: string) {
    setTraits((prev) => prev.map((trait, i) => (i === index ? value : trait)));
  }

  function removeTrait(index: number) {
    setTraits((prev) => prev.filter((_, i) => i !== index));
  }

  function addAction() {
    setActions((prev) => [...prev, createEmptyMonsterAction()]);
  }

  function updateAction(index: number, patch: Partial<MonsterActionFormState>) {
    setActions((prev) => prev.map((action, i) => (i === index ? { ...action, ...patch } : action)));
  }

  function updateActionType(index: number, actionType: MonsterActionType) {
    const visibility = ACTION_FIELD_VISIBILITY[actionType];
    const allowedIcons = ACTION_ICON_OPTIONS_BY_TYPE[actionType].map((o) => o.value);
    setActions((prev) => prev.map((action, i) => {
      if (i !== index) return action;
      const currentIcon = action.action_icon ?? null;
      const newIcon: MonsterActionIcon | null =
        actionType === "spell"
          ? "spell"
          : currentIcon !== null && !allowedIcons.includes(currentIcon)
            ? null
            : currentIcon;
      return {
        ...action,
        action_type: actionType,
        action_icon: newIcon,
        damage_type: visibility.damageType ? action.damage_type : null,
        check_die1: visibility.checkFormula ? action.check_die1 : "",
        check_die2: visibility.checkFormula ? action.check_die2 : "",
        accuracy_bonus: visibility.accuracyBonus ? action.accuracy_bonus : null,
        cost: visibility.cost ? action.cost : null,
        target: visibility.target ? action.target : null,
        duration: visibility.duration ? action.duration : null,
        is_offensive: visibility.isOffensive ? action.is_offensive : false,
      };
    }));
  }

  function removeAction(index: number) {
    setActions((prev) => prev.filter((_, i) => i !== index));
  }

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    level !== "" &&
    hp !== "" &&
    mp !== "" &&
    initiative !== "" &&
    defense !== "" &&
    magicDefense !== "" &&
    !uploadingImage &&
    traits.every((trait) => trait.trim() !== "") &&
    actions.every((action) =>
      action.name.trim() !== "" &&
      action.description.trim() !== "" &&
      (action.action_type !== "spell" ||
        (!!action.cost?.trim() && !!action.target?.trim() && !!action.duration?.trim())),
    );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
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
        img_key: imgUrl,
        is_villain: isVillain,
        ultima_points: isVillain ? Number(ultimaPoints) : 0,
        traits: traits.map((trait) => ({ trait: trait.trim() })),
        affinities,
        actions: actions.map(({ check_die1, check_die2, ...action }) => ({
          ...action,
          name: action.name.trim(),
          description: action.description.trim(),
          check_formula: buildDiceFormula([check_die1, check_die2], ""),
          cost: action.cost?.trim() || null,
          target: action.target?.trim() || null,
          duration: action.duration?.trim() || null,
        })),
        visible_to_players: visibleToPlayers,
      };

      if (initialMonster && monsterId) {
        await updateMonster(campaignId, monsterId, { ...payload });
      } else {
        await createMonster(campaignId, { ...payload });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o monstro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title={initialMonster ? "Editar monstro" : "Novo monstro"} onClose={onClose}>
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

        <div className="manage-form__field">
          <ImageUploadField
            id="mo-image"
            label="Imagem"
            {...imageFieldProps}
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

        <h3 className="manage-form__section-label">Traits (até 4)</h3>
        {traits.map((trait, index) => (
          <div className="manage-form__relation-row" key={index}>
            <input
              type="text"
              className="manage-form__input"
              value={trait}
              onChange={(e) => updateTrait(index, e.target.value)}
              required
            />
            <Button type="button" variant="ghost" onClick={() => removeTrait(index)}>
              Remover
            </Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addTrait} disabled={traits.length >= 4}>
          + Adicionar trait
        </Button>

        <h3 className="manage-form__section-label">Afinidades</h3>
        <div className="manage-form__numbers-grid-5">
          {DAMAGE_TYPE_OPTIONS.map((damageType) => (
            <div key={damageType.value} className="manage-form__field">
              <label htmlFor={`mo-aff-${damageType.value}`} className="manage-form__label">{damageType.label}</label>
              <select
                id={`mo-aff-${damageType.value}`}
                className="manage-form__select"
                value={affinities[damageType.value]}
                onChange={(e) =>
                  setAffinities((prev) => ({ ...prev, [damageType.value]: e.target.value as MonsterAffinityType }))
                }
              >
                {AFFINITY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <h3 className="manage-form__section-label">Ações</h3>
        {actions.map((action, index) => {
          const visibility = ACTION_FIELD_VISIBILITY[action.action_type];
          return (
          <div key={index} className="manage-form__field" style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor={`mo-act-name-${index}`} className="manage-form__label">
                  Nome <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`mo-act-name-${index}`}
                  type="text"
                  className="manage-form__input"
                  value={action.name}
                  onChange={(e) => updateAction(index, { name: e.target.value })}
                  required
                />
              </div>
              <div className="manage-form__field">
                <label htmlFor={`mo-act-type-${index}`} className="manage-form__label">Tipo</label>
                <select
                  id={`mo-act-type-${index}`}
                  className="manage-form__select"
                  value={action.action_type}
                  onChange={(e) => updateActionType(index, e.target.value as MonsterActionType)}
                >
                  {ACTION_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="manage-form__field">
              <label htmlFor={`mo-act-desc-${index}`} className="manage-form__label">
                Descrição <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={`mo-act-desc-${index}`}
                className="manage-form__textarea"
                value={action.description}
                onChange={(e) => updateAction(index, { description: e.target.value })}
                rows={2}
                required
              />
            </div>

            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor={`mo-act-icon-${index}`} className="manage-form__label">Ícone</label>
                <select
                  id={`mo-act-icon-${index}`}
                  className="manage-form__select"
                  disabled={action.action_type === "spell"}
                  value={action.action_icon ?? ""}
                  onChange={(e) => updateAction(index, { action_icon: (e.target.value || null) as MonsterActionIcon | null })}
                >
                  {action.action_type !== "spell" ? <option value="">—</option> : null}
                  {ACTION_ICON_OPTIONS_BY_TYPE[action.action_type].map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {visibility.damageType ? (
                <div className="manage-form__field">
                  <label htmlFor={`mo-act-damage-${index}`} className="manage-form__label">Tipo de dano</label>
                  <select
                    id={`mo-act-damage-${index}`}
                    className="manage-form__select"
                    value={action.damage_type ?? ""}
                    onChange={(e) => updateAction(index, { damage_type: (e.target.value || null) as DamageType | null })}
                  >
                    <option value="">—</option>
                    {DAMAGE_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            {visibility.checkFormula ? (
              <div className="manage-form__field">
                <label className="manage-form__label">Fórmula de teste</label>
                <div className="manage-form__numbers-grid">
                  <select
                    aria-label="Primeiro dado de teste"
                    className="manage-form__select"
                    value={action.check_die1}
                    onChange={(e) => updateAction(index, { check_die1: e.target.value })}
                  >
                    {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Segundo dado de teste"
                    className="manage-form__select"
                    value={action.check_die2}
                    onChange={(e) => updateAction(index, { check_die2: e.target.value })}
                  >
                    {ATTRIBUTE_DIE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <input
                    id={`mo-act-accuracy-${index}`}
                    type="number"
                    placeholder="Bônus"
                    className="manage-form__input"
                    value={action.accuracy_bonus ?? ""}
                    onChange={(e) => updateAction(index, { accuracy_bonus: e.target.value === "" ? null : Number(e.target.value) })}
                  />
                </div>
              </div>
            ) : null}

            {visibility.cost || visibility.target || visibility.duration ? (
              <div className="manage-form__row">
                {visibility.cost ? (
                  <div className="manage-form__field">
                    <label htmlFor={`mo-act-cost-${index}`} className="manage-form__label">
                      Custo {action.action_type === "spell" ? <span aria-hidden="true">*</span> : null}
                    </label>
                    <input
                      id={`mo-act-cost-${index}`}
                      type="text"
                      className="manage-form__input"
                      value={action.cost ?? ""}
                      onChange={(e) => updateAction(index, { cost: e.target.value || null })}
                      required={action.action_type === "spell"}
                    />
                  </div>
                ) : null}
                {visibility.target ? (
                  <div className="manage-form__field">
                    <label htmlFor={`mo-act-target-${index}`} className="manage-form__label">
                      Alvo {action.action_type === "spell" ? <span aria-hidden="true">*</span> : null}
                    </label>
                    <input
                      id={`mo-act-target-${index}`}
                      type="text"
                      className="manage-form__input"
                      value={action.target ?? ""}
                      onChange={(e) => updateAction(index, { target: e.target.value || null })}
                      required={action.action_type === "spell"}
                    />
                  </div>
                ) : null}
                {visibility.duration ? (
                  <div className="manage-form__field">
                    <label htmlFor={`mo-act-duration-${index}`} className="manage-form__label">
                      Duração {action.action_type === "spell" ? <span aria-hidden="true">*</span> : null}
                    </label>
                    <input
                      id={`mo-act-duration-${index}`}
                      type="text"
                      className="manage-form__input"
                      value={action.duration ?? ""}
                      onChange={(e) => updateAction(index, { duration: e.target.value || null })}
                      required={action.action_type === "spell"}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {visibility.isOffensive ? (
              <label className="manage-form__checkbox-field">
                <input
                  type="checkbox"
                  className="manage-form__checkbox"
                  checked={action.is_offensive ?? false}
                  onChange={(e) => updateAction(index, { is_offensive: e.target.checked })}
                />
                <span className="manage-form__checkbox-label">Ofensiva</span>
              </label>
            ) : null}

            <div className="manage-form__actions">
              <Button type="button" variant="ghost" onClick={() => removeAction(index)}>
                Remover ação
              </Button>
            </div>
          </div>
          );
        })}
        <Button type="button" variant="ghost" onClick={addAction}>
          + Adicionar ação
        </Button>

        <div className="manage-form__checkbox-field">
          <input
            id="mo-visible"
            type="checkbox"
            className="manage-form__checkbox"
            checked={visibleToPlayers}
            onChange={(e) => setVisibleToPlayers(e.target.checked)}
          />
          <label htmlFor="mo-visible" className="manage-form__checkbox-label">
            Visível para os jogadores
          </label>
        </div>

        <div className="manage-form__actions">
          <Button type="submit" variant="primary" disabled={submitting || uploadingImage || !canSubmit}>
            {initialMonster ? (submitting ? "Salvando..." : "Salvar") : (submitting ? "Criando..." : "Criar monstro")}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
