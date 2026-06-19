import { useState, useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/shared/components/button";
import { ImageUploadField } from "@/shared/components/image-upload-field";
import { createNpc } from "../api/create-npc";
import { updateNpc } from "../api/update-npc";
import { usePublicItems } from "@/features/items/hooks/use-public-items";
import { useCampaignImageUpload } from "../hooks/use-campaign-image-upload";
import type {
  AttributeDie,
  NpcSpecialRuleType,
  NpcInventoryRelationType,
  CreateNpcInventoryItemInput,
  CreateNpcEquipmentInput,
} from "../types/campaign";
import type { NpcDetail } from "@/features/npcs/types/npc";
import "../pages/campaign-manage-page.css";

const DICE_OPTIONS: readonly { value: AttributeDie; label: string }[] = [
  { value: "d6", label: "d6" },
  { value: "d8", label: "d8" },
  { value: "d10", label: "d10" },
  { value: "d12", label: "d12" },
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

type NpcSpecialRuleDraft = {
  type: NpcSpecialRuleType;
  title: string;
  description: string;
  metadata: { key: string; value: string }[];
};

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

type NpcFormModalProps = {
  campaignId: number;
  onClose: () => void;
  onSuccess: () => void;
  initialNpc?: NpcDetail;
  npcId?: number;
};

export function NpcFormModal({ campaignId, onClose, onSuccess, initialNpc, npcId }: NpcFormModalProps) {
  const [name, setName] = useState(initialNpc?.name ?? "");
  const [description, setDescription] = useState(initialNpc?.description ?? "");
  const [tagline, setTagline] = useState(initialNpc?.tagline ?? "");
  const [level, setLevel] = useState(initialNpc?.level != null ? String(initialNpc.level) : "");
  const [dexDie, setDexDie] = useState<AttributeDie | "">(
    (initialNpc?.dexterity_die as AttributeDie | null) ?? ""
  );
  const [insDie, setInsDie] = useState<AttributeDie | "">(
    (initialNpc?.insight_die as AttributeDie | null) ?? ""
  );
  const [mgtDie, setMgtDie] = useState<AttributeDie | "">(
    (initialNpc?.might_die as AttributeDie | null) ?? ""
  );
  const [wilDie, setWilDie] = useState<AttributeDie | "">(
    (initialNpc?.willpower_die as AttributeDie | null) ?? ""
  );
  const [hp, setHp] = useState(initialNpc?.hp != null ? String(initialNpc.hp) : "");
  const [mp, setMp] = useState(initialNpc?.mp != null ? String(initialNpc.mp) : "");
  const [initiative, setInitiative] = useState(initialNpc?.initiative != null ? String(initialNpc.initiative) : "");
  const [defenseMode, setDefenseMode] = useState<"fixed" | "dex_bonus">("fixed");
  const [defense, setDefense] = useState(initialNpc?.defense != null ? String(initialNpc.defense) : "");
  const [defenseBonus, setDefenseBonus] = useState("");
  const [magicDefenseMode, setMagicDefenseMode] = useState<"fixed" | "ins_bonus">("fixed");
  const [magicDefense, setMagicDefense] = useState(initialNpc?.magic_defense != null ? String(initialNpc.magic_defense) : "");
  const [magicDefenseBonus, setMagicDefenseBonus] = useState("");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [inventory, setInventory] = useState<CreateNpcInventoryItemInput[]>(
    initialNpc?.inventory.map((i) => ({
      item_id: i.item.id,
      relation_type: i.relation_type as NpcInventoryRelationType,
      quantity: i.quantity ?? 1,
    })) ?? []
  );
  const hasEquipment = !!(
    initialNpc?.equipment?.main_hand ||
    initialNpc?.equipment?.off_hand ||
    initialNpc?.equipment?.armor ||
    initialNpc?.equipment?.accessory
  );
  const [equipmentEnabled, setEquipmentEnabled] = useState(hasEquipment);
  const [equipment, setEquipment] = useState<CreateNpcEquipmentInput>({
    main_hand: initialNpc?.equipment?.main_hand?.id ?? null,
    off_hand: initialNpc?.equipment?.off_hand?.id ?? null,
    armor: initialNpc?.equipment?.armor?.id ?? null,
    accessory: initialNpc?.equipment?.accessory?.id ?? null,
  });
  const [specialRules, setSpecialRules] = useState<NpcSpecialRuleDraft[]>(
    initialNpc?.specialRules.map((r) => ({
      type: r.type as NpcSpecialRuleType,
      title: r.title,
      description: r.description,
      metadata: r.metadata
        ? Object.entries(r.metadata).map(([key, value]) => ({ key, value: String(value) }))
        : [],
    })) ?? []
  );
  const [imgUrl, setImgUrl] = useState<string | null>(initialNpc?.img_key ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: items } = usePublicItems(true);
  const allItems = items ?? [];
  const mainHandOptions = allItems.filter((item) => item.itemType === "arma" || item.itemType === "escudo");
  const armorOptions = allItems.filter((item) => item.itemType === "armadura");
  const accessoryOptions = allItems.filter((item) => item.itemType === "acessorio");
  const { uploadFile } = useCampaignImageUpload(campaignId, "npc");

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    !uploadingImage &&
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
      const payload = {
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
        img_key: imgUrl,
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
      };

      if (initialNpc && npcId) {
        await updateNpc(campaignId, npcId, payload);
      } else {
        await createNpc(campaignId, payload);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : initialNpc ? "Não foi possível salvar o NPC." : "Não foi possível criar o NPC.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal title={initialNpc ? "Editar NPC" : "Novo NPC"} onClose={onClose}>
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
          <ImageUploadField
            id="n-image"
            label="Imagem"
            value={imgUrl}
            onChange={setImgUrl}
            onUploadFile={uploadFile}
            uploading={uploadingImage}
            onUploadingChange={setUploadingImage}
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
          <Button type="submit" variant="primary" disabled={submitting || uploadingImage || !canSubmit}>
            {initialNpc ? (submitting ? "Salvando..." : "Salvar") : (submitting ? "Criando..." : "Criar NPC")}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
