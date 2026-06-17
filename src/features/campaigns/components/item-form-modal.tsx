import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/shared/components/button";
import { createItem } from "../api/create-item";
import { updateItem } from "../api/update-item";
import { toSnakeCaseKey } from "@/shared/lib/text-formatters";
import type { ItemType, WeaponCategory, DamageType, CreateItemInput } from "../types/campaign";
import type { Item } from "@/features/items/types/item";
import "../pages/campaign-manage-page.css";

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
  if (selectedDice.length === 0 && bonusValue === 0) return null;
  const parts = [...selectedDice];
  if (bonusValue !== 0 || selectedDice.length === 0) {
    parts.push(bonusValue >= 0 ? `+${bonusValue}` : `${bonusValue}`);
  }
  return parts.join(" + ");
}

function parseFormula(formula: string | null): { die1: string; die2: string; bonus: string } {
  if (!formula) return { die1: "", die2: "", bonus: "" };
  const parts = formula.split(" + ").map((s) => s.trim()).filter(Boolean);
  const dice: string[] = [];
  let bonus = "";
  for (const part of parts) {
    if (part.startsWith("d") || part.toUpperCase() === part && /^[A-Z]{2,3}$/.test(part)) {
      dice.push(part);
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n !== 0) bonus = String(n);
    }
  }
  return { die1: dice[0] ?? "", die2: dice[1] ?? "", bonus };
}

type ItemFormModalProps = {
  campaignId: number;
  initialItem?: Item;
  onClose: () => void;
  onSuccess: () => void;
};

export function ItemFormModal({ campaignId, initialItem, onClose, onSuccess }: ItemFormModalProps) {
  const isEditing = initialItem !== undefined;

  const accuracyParsed = parseFormula(initialItem?.accuracy ?? null);
  const defenseParsed = parseFormula(initialItem?.defenseDice ?? null);
  const magicDefenseParsed = parseFormula(initialItem?.magicDefenseDice ?? null);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [itemType, setItemType] = useState<ItemType>(initialItem?.itemType ?? "outros");
  const [description, setDescription] = useState(initialItem?.description ?? "");
  const [cost, setCost] = useState(initialItem?.cost != null ? String(initialItem.cost) : "");
  const [isMartial, setIsMartial] = useState(initialItem?.isMartial ?? false);

  const [weaponCategory, setWeaponCategory] = useState<WeaponCategory>(initialItem?.weaponCategory ?? "espada");
  const [accuracyDie1, setAccuracyDie1] = useState(accuracyParsed.die1);
  const [accuracyDie2, setAccuracyDie2] = useState(accuracyParsed.die2);
  const [accuracyBonus, setAccuracyBonus] = useState(accuracyParsed.bonus);
  const [damage, setDamage] = useState(initialItem?.damage ?? "");
  const [damageType, setDamageType] = useState<DamageType>((initialItem?.damageType as DamageType | null) ?? "physical");
  const [grip, setGrip] = useState<"uma_mao" | "duas_maos">(initialItem?.grip ?? "uma_mao");
  const [distance, setDistance] = useState<"corpo_a_corpo" | "a_distancia">(initialItem?.distance ?? "corpo_a_corpo");

  const [defenseDice, setDefenseDice] = useState(defenseParsed.die1);
  const [defenseBonus, setDefenseBonus] = useState(defenseParsed.bonus);
  const [magicDefenseDice, setMagicDefenseDice] = useState(magicDefenseParsed.die1);
  const [magicDefenseBonus, setMagicDefenseBonus] = useState(magicDefenseParsed.bonus);
  const [initiative, setInitiative] = useState(initialItem?.initiative ?? "");

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
      const payload: CreateItemInput = {
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
      };

      if (isEditing && initialItem) {
        await updateItem(campaignId, initialItem.id, payload);
      } else {
        await createItem(campaignId, payload);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditing ? "Não foi possível atualizar o item." : "Não foi possível criar o item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title={isEditing ? "Editar item" : "Novo item"} onClose={onClose}>
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
                  onChange={(e) => setGrip(e.target.value as "uma_mao" | "duas_maos")}
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
                onChange={(e) => setDistance(e.target.value as "corpo_a_corpo" | "a_distancia")}
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
            {submitting ? (isEditing ? "Salvando..." : "Criando...") : (isEditing ? "Salvar alterações" : "Criar item")}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
