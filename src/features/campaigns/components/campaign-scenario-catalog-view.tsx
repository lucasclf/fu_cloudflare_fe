import { useMemo, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { CatalogLayout } from "@/features/catalog/components/catalog-layout";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { Button } from "@/shared/components/button";
import { ImageUploadField } from "@/shared/components/image-upload-field";
import { useCampaignImageUpload } from "../hooks/use-campaign-image-upload";
import { usePublicScenarioEntities } from "@/features/scenario/hooks/use-public-scenario-entities";
import { SCENARIO_CATALOG_CONFIG } from "@/features/scenario/config/scenario-catalog-config";
import { ScenarioCardsPanel } from "@/features/scenario/components/scenario-cards-panel";
import { ScenarioSidebar } from "@/features/scenario/components/scenario-sidebar";
import { ScenarioDetailPanel } from "@/features/scenario/components/scenario-detail-panel";
import {
  ScenarioTypeFilter,
  type ScenarioTypeFilterValue,
} from "@/features/scenario/components/scenario-type-filter";
import { isFaction, isLocation, normalizeScenarioText } from "@/features/scenario/lib/scenario-formatters";
import { useCombinedCatalog } from "@/features/catalog/hooks/use-combined-catalog";
import { useCampaignScenarioEntities } from "../hooks/use-campaign-scenario-entities";
import { useCampaignHomeContext } from "../hooks/use-campaign-home-context";
import { updateLocation } from "../api/update-location";
import { updateFaction } from "../api/update-faction";
import { listLocations } from "../api/list-locations";
import { CampaignCategorySwitcher } from "./campaign-category-switcher";
import type { CampaignEntityCategory } from "../types/campaign-entity-category";
import type {
  LocationType,
  FactionType,
  FactionLocationRelationType,
  FactionLocationRelation,
  LocationOption,
} from "../types/campaign";
import type { ScenarioEntity, ScenarioFaction, ScenarioLocation } from "@/features/scenario/types/scenario";

import pageStyles from "@/features/scenario/pages/scenario-catalog-view.module.css";
import "../pages/campaign-manage-page.css";

type CampaignScenarioCatalogViewProps = {
  category: CampaignEntityCategory;
  onCategoryChange: (category: CampaignEntityCategory) => void;
  campaignId: number;
};

export function CampaignScenarioCatalogView({
  category,
  onCategoryChange,
  campaignId,
}: CampaignScenarioCatalogViewProps) {
  const { data: contextData } = useCampaignHomeContext();
  const isMaster = contextData.role === "master";

  const global = usePublicScenarioEntities();
  const campaign = useCampaignScenarioEntities(campaignId);
  const { data: entities, loading, error } = useCombinedCatalog(global, campaign);
  const entitiesList = useMemo(() => {
    const seen = new Set<string>();
    return (entities ?? []).filter((e) => {
      if (seen.has(e.uid)) return false;
      seen.add(e.uid);
      return true;
    });
  }, [entities]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ScenarioTypeFilterValue>(null);
  const [selectedEntityUid, setSelectedEntityUid] = useState<string | null>(
    null,
  );
  const [sidebarResetVersion, setSidebarResetVersion] = useState(0);
  const [editingEntity, setEditingEntity] = useState<ScenarioEntity | null>(null);

  const selectedEntity = useMemo(() => {
    if (!selectedEntityUid) {
      return null;
    }

    return entitiesList.find((entity) => entity.uid === selectedEntityUid) ?? null;
  }, [entitiesList, selectedEntityUid]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setSelectedEntityUid(null);
  }

  function handleTypeFilterChange(value: ScenarioTypeFilterValue) {
    setTypeFilter(value);
    setSelectedEntityUid(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectEntity(uid: string) {
    setSelectedEntityUid(uid);
    setSearch("");
    setTypeFilter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleResetFilters() {
    setSearch("");
    setTypeFilter(null);
    setSelectedEntityUid(null);
    setSidebarResetVersion((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredEntities = useMemo(() => {
    const query = normalizeScenarioText(search);

    return entitiesList.filter((entity) => {
      const matchesType = !typeFilter || entity.type === typeFilter;

      const searchableText = [
        entity.name,
        entity.tagline ?? "",
        entity.description ?? "",
        isFaction(entity) ? (entity.subtype ?? "") : "",
        isFaction(entity)
          ? (entity.location_relations ?? [])
              .map(
                (relation) =>
                  `${relation.location_name} ${relation.relation_type}`,
              )
              .join(" ")
          : "",
      ].join(" ");

      const matchesSearch =
        !query || normalizeScenarioText(searchableText).includes(query);

      return matchesType && matchesSearch;
    });
  }, [entitiesList, search, typeFilter]);

  const locationCount = useMemo(() => {
    return entitiesList.filter((entity) => entity.type === "location").length;
  }, [entitiesList]);

  const factionCount = useMemo(() => {
    return entitiesList.filter((entity) => entity.type === "faction").length;
  }, [entitiesList]);

  // Only campaign-owned entities (uid prefixed with "location-" or "faction-") can be edited
  function isCampaignEntity(entity: ScenarioEntity): boolean {
    return entity.uid.startsWith("location-") || entity.uid.startsWith("faction-");
  }

  return (
    <>
      {editingEntity && isLocation(editingEntity) ? (
        <LocationEditModal
          campaignId={campaignId}
          entity={editingEntity}
          onClose={() => setEditingEntity(null)}
          onSuccess={() => {
            setEditingEntity(null);
            campaign.reload?.();
          }}
        />
      ) : null}

      {editingEntity && isFaction(editingEntity) ? (
        <FactionEditModal
          campaignId={campaignId}
          entity={editingEntity}
          onClose={() => setEditingEntity(null)}
          onSuccess={() => {
            setEditingEntity(null);
            campaign.reload?.();
          }}
        />
      ) : null}

      <CatalogLayout
        sidebarHeaderTitle={SCENARIO_CATALOG_CONFIG.layout.sidebarHeaderTitle}
        sidebarHeaderSubtitle={
          SCENARIO_CATALOG_CONFIG.layout.sidebarHeaderSubtitle
        }
        searchPlaceholder={SCENARIO_CATALOG_CONFIG.layout.searchPlaceholder}
        searchValue={search}
        onSearchChange={handleSearchChange}
        categorySwitcher={
          <CampaignCategorySwitcher value={category} onChange={onCategoryChange} />
        }
        searchExtraContent={
          <div className={pageStyles.filterBlock}>
            <ScenarioTypeFilter
              value={typeFilter}
              onChange={handleTypeFilterChange}
            />

            <button
              type="button"
              onClick={handleResetFilters}
              className={pageStyles.resetButton}
            >
              {SCENARIO_CATALOG_CONFIG.copy.sidebar.resetFiltersLabel}
            </button>
          </div>
        }
        sidebarContent={
          loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <>
              <div className={pageStyles.summary}>
                <span>{locationCount} locais</span>
                <span>{factionCount} facções</span>
              </div>

              <ScenarioSidebar
                key={sidebarResetVersion}
                entities={entitiesList}
                selectedEntityUid={selectedEntityUid}
                onSelectEntity={handleSelectEntity}
              />
            </>
          )
        }
        mainContent={
          loading ? (
            <LoadingState
              message={SCENARIO_CATALOG_CONFIG.copy.main.loadingMessage}
            />
          ) : error ? (
            <ErrorState message={error} />
          ) : selectedEntity ? (
            <div>
              {isMaster && isCampaignEntity(selectedEntity) ? (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingEntity(selectedEntity)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 6 }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar
                  </Button>
                </div>
              ) : null}
              <ScenarioDetailPanel entity={selectedEntity} entities={entitiesList} />
            </div>
          ) : (
            <ScenarioCardsPanel entities={filteredEntities} />
          )
        }
      />
    </>
  );
}

// ─── Location Edit Modal ──────────────────────────────────────────────────────

const LOCATION_TYPE_OPTIONS: readonly { value: LocationType; label: string }[] = [
  { value: "region", label: "Região" },
  { value: "city", label: "Cidade" },
  { value: "village", label: "Vilarejo" },
  { value: "dungeon", label: "Masmorra" },
  { value: "landmark", label: "Marco" },
  { value: "building", label: "Edifício" },
  { value: "other", label: "Outro" },
];

type LocationEditModalProps = {
  campaignId: number;
  entity: ScenarioLocation;
  onClose: () => void;
  onSuccess: () => void;
};

function LocationEditModal({ campaignId, entity, onClose, onSuccess }: LocationEditModalProps) {
  const [name, setName] = useState(entity.name);
  const [tagline, setTagline] = useState(entity.tagline ?? "");
  const [description, setDescription] = useState(entity.description ?? "");
  const [imgUrl, setImgUrl] = useState<string | null>(entity.img_key ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [locationType, setLocationType] = useState<LocationType>((entity.subtype as LocationType | null) ?? "other");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile } = useCampaignImageUpload(campaignId, "location");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateLocation(campaignId, entity.id, {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        img_key: imgUrl,
        location_type: locationType,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "" && !uploadingImage;

  return (
    <div
      className="manage-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="manage-modal" role="dialog" aria-modal="true">
        <div className="manage-modal__header">
          <h2 className="manage-modal__title">Editar local</h2>
          <button type="button" className="manage-modal__close" onClick={onClose} aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="manage-modal__body">
          <form onSubmit={handleSubmit} noValidate>
            {error ? <p className="manage-form__error">{error}</p> : null}

            <div className="manage-form__field">
              <label htmlFor="lo-name" className="manage-form__label">
                Nome <span aria-hidden="true">*</span>
              </label>
              <input
                id="lo-name"
                type="text"
                className="manage-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="lo-tagline" className="manage-form__label">
                Tagline <span aria-hidden="true">*</span>
              </label>
              <input
                id="lo-tagline"
                type="text"
                className="manage-form__input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="lo-description" className="manage-form__label">
                Descrição <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="lo-description"
                className="manage-form__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="lo-type" className="manage-form__label">Tipo</label>
              <select
                id="lo-type"
                className="manage-form__select"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as LocationType)}
              >
                {LOCATION_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="manage-form__field">
              <ImageUploadField
                id="lo-image"
                label="Imagem"
                value={imgUrl}
                onChange={setImgUrl}
                onUploadFile={uploadFile}
                uploading={uploadingImage}
                onUploadingChange={setUploadingImage}
              />
            </div>

            <div className="manage-form__checkbox-field">
              <input
                id="lo-visible"
                type="checkbox"
                className="manage-form__checkbox"
                checked={visibleToPlayers}
                onChange={(e) => setVisibleToPlayers(e.target.checked)}
              />
              <label htmlFor="lo-visible" className="manage-form__checkbox-label">
                Visível para jogadores
              </label>
            </div>

            <div className="manage-form__actions">
              <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
                {submitting ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Faction Edit Modal ───────────────────────────────────────────────────────

const FACTION_TYPE_OPTIONS: readonly { value: FactionType; label: string }[] = [
  { value: "guild", label: "Guilda" },
  { value: "kingdom", label: "Nação" },
  { value: "order", label: "Ordem" },
  { value: "cult", label: "Culto" },
  { value: "clan", label: "Clã" },
  { value: "company", label: "Companhia" },
  { value: "criminal", label: "Organização criminosa" },
  { value: "military", label: "Força militar" },
  { value: "other", label: "Outro" },
];

const RELATION_TYPE_OPTIONS: readonly { value: FactionLocationRelationType; label: string }[] = [
  { value: "headquarters", label: "Sede" },
  { value: "origin", label: "Origem" },
  { value: "territory", label: "Território" },
  { value: "influence", label: "Influência" },
  { value: "presence", label: "Presença" },
  { value: "enemy_presence", label: "Presença Hostil" },
  { value: "other", label: "Outro" },
];

type FactionEditModalProps = {
  campaignId: number;
  entity: ScenarioFaction;
  onClose: () => void;
  onSuccess: () => void;
};

function FactionEditModal({ campaignId, entity, onClose, onSuccess }: FactionEditModalProps) {
  const [name, setName] = useState(entity.name);
  const [tagline, setTagline] = useState(entity.tagline ?? "");
  const [description, setDescription] = useState(entity.description ?? "");
  const [imgUrl, setImgUrl] = useState<string | null>(entity.img_key ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [factionType, setFactionType] = useState<FactionType>((entity.subtype as FactionType | null) ?? "other");
  const [visibleToPlayers, setVisibleToPlayers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile } = useCampaignImageUpload(campaignId, "faction");

  // Location relations state
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [relations, setRelations] = useState<FactionLocationRelation[]>(() => {
    const existingRelations = entity.location_relations ?? [];
    return existingRelations.map((r) => ({
      location_id: r.location_id,
      relation_type: (r.relation_type as FactionLocationRelationType) ?? "other",
    }));
  });

  useEffect(() => {
    listLocations(campaignId).then(setLocationOptions).catch(() => {
      // silently fail — faction can still be edited without location list
    });
  }, [campaignId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function addRelation() {
    if (locationOptions.length === 0) return;
    setRelations((prev) => [
      ...prev,
      { location_id: locationOptions[0].id, relation_type: "other" },
    ]);
  }

  function removeRelation(index: number) {
    setRelations((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRelationField<K extends keyof FactionLocationRelation>(
    index: number,
    field: K,
    value: FactionLocationRelation[K],
  ) {
    setRelations((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateFaction(campaignId, entity.id, {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        img_key: imgUrl,
        faction_type: factionType,
        faction_location_relation: relations,
        visible_to_players: visibleToPlayers,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = name.trim() !== "" && tagline.trim() !== "" && description.trim() !== "" && !uploadingImage;

  return (
    <div
      className="manage-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="manage-modal" role="dialog" aria-modal="true">
        <div className="manage-modal__header">
          <h2 className="manage-modal__title">Editar facção</h2>
          <button type="button" className="manage-modal__close" onClick={onClose} aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="manage-modal__body">
          <form onSubmit={handleSubmit} noValidate>
            {error ? <p className="manage-form__error">{error}</p> : null}

            <div className="manage-form__field">
              <label htmlFor="fa-name" className="manage-form__label">
                Nome <span aria-hidden="true">*</span>
              </label>
              <input
                id="fa-name"
                type="text"
                className="manage-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="fa-tagline" className="manage-form__label">
                Tagline <span aria-hidden="true">*</span>
              </label>
              <input
                id="fa-tagline"
                type="text"
                className="manage-form__input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="fa-description" className="manage-form__label">
                Descrição <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="fa-description"
                className="manage-form__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="manage-form__field">
              <label htmlFor="fa-type" className="manage-form__label">Tipo</label>
              <select
                id="fa-type"
                className="manage-form__select"
                value={factionType}
                onChange={(e) => setFactionType(e.target.value as FactionType)}
              >
                {FACTION_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="manage-form__field">
              <ImageUploadField
                id="fa-image"
                label="Imagem"
                value={imgUrl}
                onChange={setImgUrl}
                onUploadFile={uploadFile}
                uploading={uploadingImage}
                onUploadingChange={setUploadingImage}
              />
            </div>

            <p className="manage-form__section-label">Relações com locais</p>

            {relations.map((relation, index) => (
              <div key={index} className="manage-form__relation-row" style={{ marginBottom: 8 }}>
                <select
                  aria-label="Local"
                  className="manage-form__select"
                  value={relation.location_id}
                  onChange={(e) => updateRelationField(index, "location_id", Number(e.target.value))}
                >
                  {locationOptions.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <select
                  aria-label="Tipo de relação"
                  className="manage-form__select"
                  value={relation.relation_type}
                  onChange={(e) => updateRelationField(index, "relation_type", e.target.value as FactionLocationRelationType)}
                >
                  {RELATION_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeRelation(index)}
                  aria-label="Remover relação"
                  style={{
                    background: "none",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    padding: "4px 8px",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {locationOptions.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={addRelation}
                style={{ marginBottom: 16 }}
              >
                + Adicionar relação
              </Button>
            ) : null}

            <div className="manage-form__checkbox-field">
              <input
                id="fa-visible"
                type="checkbox"
                className="manage-form__checkbox"
                checked={visibleToPlayers}
                onChange={(e) => setVisibleToPlayers(e.target.checked)}
              />
              <label htmlFor="fa-visible" className="manage-form__checkbox-label">
                Visível para jogadores
              </label>
            </div>

            <div className="manage-form__actions">
              <Button type="submit" variant="primary" disabled={submitting || !canSubmit}>
                {submitting ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
