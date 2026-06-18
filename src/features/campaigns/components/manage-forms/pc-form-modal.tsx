import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/shared/components/button";
import { createPc } from "../../api/create-pc";
import { listCampaignItems } from "../../api/list-items";
import { listCampaignPcs } from "../../api/list-pcs";
import { listCampaignNpcs } from "../../api/list-npcs";
import { listCampaignMonsters } from "../../api/list-monsters";
import { getPublicJobCatalog } from "@/features/jobs/api/get-public-job-catalog";
import { getPublicPowers } from "@/features/powers/api/get-public-powers";
import { getPublicSpells } from "@/features/spells/api/get-public-spells";
import { getPublicItems } from "@/features/items/api/get-public-items";
import type {
  AttributeDie,
  BondTargetType,
  AdmirationAxis,
  LoyaltyAxis,
  AffectionAxis,
} from "../../types/campaign";
import type { JobCatalogItem } from "@/features/jobs/types/job";
import type { Power } from "@/features/powers/types/power";
import type { Spell } from "@/features/spells/types/spell";
import type { Item } from "@/features/items/types/item";
import type { PcSummary } from "@/features/pcs/types/pc";
import type { NpcSummary } from "@/features/npcs/types/npc";
import type { MonsterSummary } from "@/features/monsters/types/monster";
import { FormModal, type FormProps } from "./form-modal";
import { EquipmentSlotSelect } from "./equipment-slot-select";

const DICE_OPTIONS: readonly { value: AttributeDie; label: string }[] = [
  { value: "d6", label: "d6" },
  { value: "d8", label: "d8" },
  { value: "d10", label: "d10" },
  { value: "d12", label: "d12" },
];

type PcLevelEntry = {
  job_id: number | null;
  power_id: number | null;
  spell_id: number | null;
};

type PcBondEntry = {
  target_type: BondTargetType;
  target_id: number | null;
  target_name: string;
  admiration_axis: AdmirationAxis | "";
  loyalty_axis: LoyaltyAxis | "";
  affection_axis: AffectionAxis | "";
  description: string;
};

type PcInventoryEntry = {
  item_id: number | null;
  quantity: number;
};

export function PcFormModal({ campaignId, onClose, onSuccess }: FormProps) {
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

  const [pcLevels, setPcLevels] = useState<PcLevelEntry[]>([]);
  const [heroicPowerByJobId, setHeroicPowerByJobId] = useState<Record<number, number | null>>({});
  const [equipmentEnabled, setEquipmentEnabled] = useState(false);
  const [equipment, setEquipment] = useState<{ main_hand: number | null; off_hand: number | null; armor: number | null; accessory: number | null }>({ main_hand: null, off_hand: null, armor: null, accessory: null });
  const [inventory, setInventory] = useState<PcInventoryEntry[]>([]);
  const [bonds, setBonds] = useState<PcBondEntry[]>([]);

  const [campaignJobs, setCampaignJobs] = useState<JobCatalogItem[]>([]);
  const [campaignPowers, setCampaignPowers] = useState<Power[]>([]);
  const [campaignSpells, setCampaignSpells] = useState<Spell[]>([]);
  const [campaignItems, setCampaignItems] = useState<Item[]>([]);
  const [campaignPcs, setCampaignPcs] = useState<PcSummary[]>([]);
  const [campaignNpcs, setCampaignNpcs] = useState<NpcSummary[]>([]);
  const [campaignMonsters, setCampaignMonsters] = useState<MonsterSummary[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublicJobCatalog(),
      getPublicPowers(),
      getPublicSpells(),
      getPublicItems(),
      listCampaignItems(campaignId),
      listCampaignPcs(campaignId),
      listCampaignNpcs(campaignId),
      listCampaignMonsters(campaignId),
    ]).then(([jobs, powers, spells, globalItems, campaignOnlyItems, pcs, npcs, monsters]) => {
      if (!cancelled) {
        setCampaignJobs(jobs);
        setCampaignPowers(powers);
        setCampaignSpells(spells);
        // Mescla itens globais + exclusivos da campanha, sem duplicar por ID
        const globalIds = new Set(globalItems.map((i) => i.id));
        const mergedItems = [...globalItems, ...campaignOnlyItems.filter((i) => !globalIds.has(i.id))];
        setCampaignItems(mergedItems);
        setCampaignPcs(pcs);
        setCampaignNpcs(npcs);
        setCampaignMonsters(monsters);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [campaignId]);

  function computeJobLevelCounts(): Map<number, number> {
    const counts = new Map<number, number>();
    for (const lv of pcLevels) {
      if (lv.job_id !== null) counts.set(lv.job_id, (counts.get(lv.job_id) ?? 0) + 1);
    }
    return counts;
  }

  // Retorna poderes comuns disponíveis para o nível `levelIndex`, com o nivel atual de cada um.
  // Poderes heroicos são excluídos. Um poder some quando atinge max_level via outras seleções,
  // mas permanece visível se estiver selecionado neste próprio nível (para manter o valor atual).
  function getAvailableCommonPowersForLevel(levelIndex: number, job: JobCatalogItem | null): Array<{ power: Power; currentLevel: number }> {
    const basePowers = campaignPowers.filter((p) =>
      p.type !== "heroic" &&
      (job === null ? p.is_global : p.is_global || p.job_name.includes(job.name)),
    );
    const currentSelectedId = pcLevels[levelIndex]?.power_id ?? null;
    const countsFromOthers = new Map<number, number>();
    for (let i = 0; i < pcLevels.length; i++) {
      if (i === levelIndex) continue;
      const lvPow = pcLevels[i].power_id;
      if (lvPow !== null) countsFromOthers.set(lvPow, (countsFromOthers.get(lvPow) ?? 0) + 1);
    }
    return basePowers
      .filter((p) => (countsFromOthers.get(p.id) ?? 0) < p.max_level || p.id === currentSelectedId)
      .map((p) => ({ power: p, currentLevel: countsFromOthers.get(p.id) ?? 0 }));
  }

  function getAvailableHeroicPowers(level10JobNames: Set<string>): Power[] {
    return campaignPowers.filter(
      (p) => p.type === "heroic" && (p.is_global || p.job_name.some((jn) => level10JobNames.has(jn))),
    );
  }

  function jobAllowsSpells(job: JobCatalogItem | null): boolean {
    if (!job) return false;
    return Boolean(job.allowsArcane) || Boolean(job.allowsRituals);
  }

  function addLevel() {
    const defaultJobId = campaignJobs.length > 0 ? campaignJobs[0].id : null;
    setPcLevels((prev) => [...prev, { job_id: defaultJobId, power_id: null, spell_id: null }]);
  }

  function updateLevel(index: number, patch: Partial<PcLevelEntry>) {
    setPcLevels((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function removeLevel(index: number) {
    setPcLevels((prev) => prev.filter((_, i) => i !== index));
  }

  function addInventoryItem() {
    if (campaignItems.length === 0) return;
    setInventory((prev) => [...prev, { item_id: campaignItems[0].id, quantity: 1 }]);
  }

  function updateInventoryItem(index: number, patch: Partial<PcInventoryEntry>) {
    setInventory((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeInventoryItem(index: number) {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  }

  function addBond() {
    setBonds((prev) => [...prev, { target_type: "freeform", target_id: null, target_name: "", admiration_axis: "", loyalty_axis: "", affection_axis: "", description: "" }]);
  }

  function updateBond(index: number, patch: Partial<PcBondEntry>) {
    setBonds((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function removeBond(index: number) {
    setBonds((prev) => prev.filter((_, i) => i !== index));
  }

  const weaponItems = campaignItems.filter((i) => i.itemType === "arma" || i.itemType === "escudo");
  const armorItems = campaignItems.filter((i) => i.itemType === "armadura");
  const accessoryItems = campaignItems.filter((i) => i.itemType === "acessorio");

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    origin.trim() !== "" &&
    identity.trim() !== "" &&
    theme.trim() !== "" &&
    inventory.every((i) => i.item_id !== null && i.quantity >= 1) &&
    bonds.every((b) => b.target_type === "freeform" ? b.target_name.trim() !== "" : b.target_id !== null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const jobMap = new Map<number, { job_id: number; level: number }>();
      for (const lv of pcLevels) {
        if (lv.job_id === null) continue;
        const existing = jobMap.get(lv.job_id);
        if (existing) existing.level++;
        else jobMap.set(lv.job_id, { job_id: lv.job_id, level: 1 });
      }
      const powerMap = new Map<number, { power_id: number; level: number }>();
      for (const lv of pcLevels) {
        if (lv.power_id === null) continue;
        const existing = powerMap.get(lv.power_id);
        if (existing) existing.level++;
        else powerMap.set(lv.power_id, { power_id: lv.power_id, level: 1 });
      }
      for (const heroicPowerId of Object.values(heroicPowerByJobId)) {
        if (heroicPowerId === null) continue;
        const existing = powerMap.get(heroicPowerId);
        if (existing) existing.level++;
        else powerMap.set(heroicPowerId, { power_id: heroicPowerId, level: 1 });
      }
      const spellIds = Array.from(new Set(pcLevels.filter((l) => l.spell_id !== null).map((l) => l.spell_id as number)));

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
        jobs: Array.from(jobMap.values()).map((j) => ({ ...j, ignore_hp_bonus: false, ignore_mp_bonus: false })),
        powers: Array.from(powerMap.values()),
        spells: spellIds,
        equipment: equipmentEnabled ? equipment : undefined,
        inventory: inventory.map((i) => ({ item_id: i.item_id!, quantity: i.quantity })),
        bonds: bonds.map((b) => ({
          target_type: b.target_type,
          target_id: b.target_type !== "freeform" ? b.target_id : null,
          target_name: b.target_type === "freeform" ? b.target_name.trim() : null,
          admiration_axis: b.admiration_axis || null,
          loyalty_axis: b.loyalty_axis || null,
          affection_axis: b.affection_axis || null,
          description: b.description.trim() || null,
        })),
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
            <label htmlFor="pc-name" className="manage-form__label">Nome <span aria-hidden="true">*</span></label>
            <input id="pc-name" type="text" className="manage-form__input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div className="manage-form__field">
            <label htmlFor="pc-pronouns" className="manage-form__label">Pronomes</label>
            <input id="pc-pronouns" type="text" className="manage-form__input" value={pronouns} onChange={(e) => setPronouns(e.target.value)} placeholder="ex.: ele/dele" />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-tagline" className="manage-form__label">Tagline</label>
          <input id="pc-tagline" type="text" className="manage-form__input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-desc" className="manage-form__label">Descrição <span aria-hidden="true">*</span></label>
          <textarea id="pc-desc" className="manage-form__textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
        </div>

        <div className="manage-form__row">
          <div className="manage-form__field">
            <label htmlFor="pc-origin" className="manage-form__label">Origem <span aria-hidden="true">*</span></label>
            <input id="pc-origin" type="text" className="manage-form__input" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
          </div>
          <div className="manage-form__field">
            <label htmlFor="pc-money" className="manage-form__label">Zeni</label>
            <input id="pc-money" type="number" className="manage-form__input" value={money} onChange={(e) => setMoney(e.target.value)} min={0} />
          </div>
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-identity" className="manage-form__label">Identidade <span aria-hidden="true">*</span></label>
          <input id="pc-identity" type="text" className="manage-form__input" value={identity} onChange={(e) => setIdentity(e.target.value)} required />
        </div>

        <div className="manage-form__field">
          <label htmlFor="pc-theme" className="manage-form__label">Tema <span aria-hidden="true">*</span></label>
          <input id="pc-theme" type="text" className="manage-form__input" value={theme} onChange={(e) => setTheme(e.target.value)} required />
        </div>

        <p className="manage-form__section-label">Atributos base</p>

        <div className="manage-form__dice-grid">
          {([
            { id: "pc-dex", label: "DES", value: dexDie, setter: setDexDie },
            { id: "pc-ins", label: "AST", value: insDie, setter: setInsDie },
            { id: "pc-mgt", label: "VIG", value: mgtDie, setter: setMgtDie },
            { id: "pc-wil", label: "VON", value: wilDie, setter: setWilDie },
          ] as const).map(({ id, label, value, setter }) => (
            <div key={id} className="manage-form__field">
              <label htmlFor={id} className="manage-form__label">{label}</label>
              <select id={id} className="manage-form__select" value={value} onChange={(e) => setter(e.target.value as AttributeDie)}>
                {DICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>

        <p className="manage-form__section-label">Níveis</p>
        {campaignJobs.length === 0 ? (
          <p className="manage-form__hint">Carregando classes…</p>
        ) : null}
        {pcLevels.map((lv, index) => {
          const selectedJob = campaignJobs.find((j) => j.id === lv.job_id) ?? null;
          const availablePowers = getAvailableCommonPowersForLevel(index, selectedJob);
          const showSpell = jobAllowsSpells(selectedJob);
          const jobCountsExcludingThis = new Map<number, number>();
          for (let i = 0; i < pcLevels.length; i++) {
            if (i === index) continue;
            const jid = pcLevels[i].job_id;
            if (jid !== null) jobCountsExcludingThis.set(jid, (jobCountsExcludingThis.get(jid) ?? 0) + 1);
          }
          return (
            <div key={index} className="manage-form__level-entry">
              <div className="manage-form__level-header">
                <span className="manage-form__label">Nível {index + 1}</span>
                <Button type="button" variant="ghost" onClick={() => removeLevel(index)}>Remover</Button>
              </div>
              <div className="manage-form__row">
                <div className="manage-form__field">
                  <label htmlFor={`pc-lv-job-${index}`} className="manage-form__label">Classe</label>
                  <select
                    id={`pc-lv-job-${index}`}
                    className="manage-form__select"
                    value={lv.job_id ?? ""}
                    onChange={(e) => {
                      const newJobId = e.target.value === "" ? null : Number(e.target.value);
                      updateLevel(index, { job_id: newJobId, power_id: null, spell_id: null });
                    }}
                  >
                    <option value="">— selecione —</option>
                    {campaignJobs.map((j) => {
                      const countElsewhere = jobCountsExcludingThis.get(j.id) ?? 0;
                      const atMax = countElsewhere >= 10 && lv.job_id !== j.id;
                      return (
                        <option key={j.id} value={j.id} disabled={atMax}>
                          {j.name}{atMax ? " (máx. 10)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="manage-form__field">
                  <label htmlFor={`pc-lv-pow-${index}`} className="manage-form__label">Poder</label>
                  <select
                    id={`pc-lv-pow-${index}`}
                    className="manage-form__select"
                    value={lv.power_id ?? ""}
                    onChange={(e) => updateLevel(index, { power_id: e.target.value === "" ? null : Number(e.target.value) })}
                  >
                    <option value="">— selecione —</option>
                    {availablePowers.map(({ power: p, currentLevel }) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({currentLevel}/{p.max_level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {showSpell ? (
                <div className="manage-form__field">
                  <label htmlFor={`pc-lv-spell-${index}`} className="manage-form__label">Magia (opcional)</label>
                  <select
                    id={`pc-lv-spell-${index}`}
                    className="manage-form__select"
                    value={lv.spell_id ?? ""}
                    onChange={(e) => updateLevel(index, { spell_id: e.target.value === "" ? null : Number(e.target.value) })}
                  >
                    <option value="">— nenhuma —</option>
                    {campaignSpells.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              ) : null}
            </div>
          );
        })}
        <Button type="button" variant="ghost" disabled={campaignJobs.length === 0} onClick={addLevel}>
          + Adicionar nível
        </Button>
        {(() => {
          const jobLevelCounts = computeJobLevelCounts();
          const level10Jobs = campaignJobs.filter((j) => (jobLevelCounts.get(j.id) ?? 0) >= 10);
          if (level10Jobs.length === 0) return null;
          const level10JobNames = new Set(level10Jobs.map((j) => j.name));
          const heroicOptions = getAvailableHeroicPowers(level10JobNames);
          return (
            <>
              <p className="manage-form__section-label">Poderes heroicos</p>
              {level10Jobs.map((job) => (
                <div key={job.id} className="manage-form__field">
                  <label htmlFor={`pc-heroic-${job.id}`} className="manage-form__label">
                    Poder heroico — {job.name}
                  </label>
                  <select
                    id={`pc-heroic-${job.id}`}
                    className="manage-form__select"
                    value={heroicPowerByJobId[job.id] ?? ""}
                    onChange={(e) =>
                      setHeroicPowerByJobId((prev) => ({
                        ...prev,
                        [job.id]: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                  >
                    <option value="">— selecione —</option>
                    {heroicOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </>
          );
        })()}

        <p className="manage-form__section-label">Inventário</p>
        {campaignItems.length === 0 ? (
          <p className="manage-form__hint">Nenhum item vinculado a esta campanha.</p>
        ) : null}
        {inventory.map((item, index) => (
          <div className="manage-form__row" key={index}>
            <div className="manage-form__field">
              <label htmlFor={`pc-inv-item-${index}`} className="manage-form__label">Item</label>
              <select
                id={`pc-inv-item-${index}`}
                className="manage-form__select"
                value={item.item_id ?? ""}
                onChange={(e) => updateInventoryItem(index, { item_id: e.target.value === "" ? null : Number(e.target.value) })}
              >
                <option value="">— selecione —</option>
                {campaignItems.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="manage-form__field">
              <label htmlFor={`pc-inv-qty-${index}`} className="manage-form__label">Quantidade</label>
              <div className="manage-form__relation-row">
                <input
                  id={`pc-inv-qty-${index}`}
                  type="number"
                  className="manage-form__input"
                  style={{ width: "80px" }}
                  value={item.quantity}
                  onChange={(e) => updateInventoryItem(index, { quantity: Number(e.target.value) })}
                  min={1}
                />
                <Button type="button" variant="ghost" onClick={() => removeInventoryItem(index)}>Remover</Button>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="ghost" disabled={campaignItems.length === 0} onClick={addInventoryItem}>
          + Adicionar item
        </Button>

        <div className="manage-form__checkbox-field">
          <input id="pc-equipment-enabled" type="checkbox" className="manage-form__checkbox" checked={equipmentEnabled} onChange={(e) => setEquipmentEnabled(e.target.checked)} disabled={campaignItems.length === 0} />
          <label htmlFor="pc-equipment-enabled" className="manage-form__checkbox-label">Incluir equipamento</label>
        </div>

        {equipmentEnabled && campaignItems.length > 0 ? (
          <>
            <p className="manage-form__section-label">Equipamento</p>
            <div className="manage-form__dice-grid">
              <EquipmentSlotSelect id="pc-eq-main-hand" label="Mão principal" options={weaponItems} value={equipment.main_hand} onChange={(value) => setEquipment((prev) => ({ ...prev, main_hand: value }))} />
              <EquipmentSlotSelect id="pc-eq-off-hand" label="Mão secundária" options={weaponItems} value={equipment.off_hand} onChange={(value) => setEquipment((prev) => ({ ...prev, off_hand: value }))} />
              <EquipmentSlotSelect id="pc-eq-armor" label="Armadura" options={armorItems} value={equipment.armor} onChange={(value) => setEquipment((prev) => ({ ...prev, armor: value }))} />
              <EquipmentSlotSelect id="pc-eq-accessory" label="Acessório" options={accessoryItems} value={equipment.accessory} onChange={(value) => setEquipment((prev) => ({ ...prev, accessory: value }))} />
            </div>
          </>
        ) : null}

        <p className="manage-form__section-label">Vínculos</p>
        {bonds.map((bond, index) => (
          <div key={index} className="manage-form__level-entry">
            <div className="manage-form__level-header">
              <span className="manage-form__label">Vínculo {index + 1}</span>
              <Button type="button" variant="ghost" onClick={() => removeBond(index)}>Remover</Button>
            </div>
            <div className="manage-form__row">
              <div className="manage-form__field">
                <label htmlFor={`pc-bond-type-${index}`} className="manage-form__label">Tipo de alvo</label>
                <select
                  id={`pc-bond-type-${index}`}
                  className="manage-form__select"
                  value={bond.target_type}
                  onChange={(e) => updateBond(index, { target_type: e.target.value as BondTargetType, target_id: null, target_name: "" })}
                >
                  <option value="freeform">Texto livre</option>
                  <option value="pc">Personagem (PC)</option>
                  <option value="npc">NPC</option>
                  <option value="monster">Monstro</option>
                </select>
              </div>
              <div className="manage-form__field">
                {bond.target_type === "freeform" ? (
                  <>
                    <label htmlFor={`pc-bond-name-${index}`} className="manage-form__label">Nome <span aria-hidden="true">*</span></label>
                    <input id={`pc-bond-name-${index}`} type="text" className="manage-form__input" value={bond.target_name} onChange={(e) => updateBond(index, { target_name: e.target.value })} />
                  </>
                ) : (
                  <>
                    <label htmlFor={`pc-bond-target-${index}`} className="manage-form__label">
                      {bond.target_type === "pc" ? "Personagem" : bond.target_type === "npc" ? "NPC" : "Monstro"} <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id={`pc-bond-target-${index}`}
                      className="manage-form__select"
                      value={bond.target_id ?? ""}
                      onChange={(e) => updateBond(index, { target_id: e.target.value === "" ? null : Number(e.target.value) })}
                    >
                      <option value="">— selecione —</option>
                      {bond.target_type === "pc"
                        ? campaignPcs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)
                        : bond.target_type === "npc"
                          ? campaignNpcs.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)
                          : campaignMonsters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className="manage-form__numbers-grid">
              <div className="manage-form__field">
                <label htmlFor={`pc-bond-adm-${index}`} className="manage-form__label">Admiração</label>
                <select id={`pc-bond-adm-${index}`} className="manage-form__select" value={bond.admiration_axis} onChange={(e) => updateBond(index, { admiration_axis: e.target.value as AdmirationAxis | "" })}>
                  <option value="">—</option>
                  <option value="admiration">Admiração</option>
                  <option value="inferiority">Inferioridade</option>
                </select>
              </div>
              <div className="manage-form__field">
                <label htmlFor={`pc-bond-loy-${index}`} className="manage-form__label">Lealdade</label>
                <select id={`pc-bond-loy-${index}`} className="manage-form__select" value={bond.loyalty_axis} onChange={(e) => updateBond(index, { loyalty_axis: e.target.value as LoyaltyAxis | "" })}>
                  <option value="">—</option>
                  <option value="loyalty">Lealdade</option>
                  <option value="mistrust">Desconfiança</option>
                </select>
              </div>
              <div className="manage-form__field">
                <label htmlFor={`pc-bond-aff-${index}`} className="manage-form__label">Afeto</label>
                <select id={`pc-bond-aff-${index}`} className="manage-form__select" value={bond.affection_axis} onChange={(e) => updateBond(index, { affection_axis: e.target.value as AffectionAxis | "" })}>
                  <option value="">—</option>
                  <option value="affection">Afeto</option>
                  <option value="hatred">Ódio</option>
                </select>
              </div>
            </div>
            <div className="manage-form__field">
              <label htmlFor={`pc-bond-desc-${index}`} className="manage-form__label">Descrição</label>
              <input id={`pc-bond-desc-${index}`} type="text" className="manage-form__input" value={bond.description} onChange={(e) => updateBond(index, { description: e.target.value })} />
            </div>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addBond}>+ Adicionar vínculo</Button>

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
