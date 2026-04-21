import { PageTitle } from "../../../shared/components/page-title";
import { CategoryGrid } from "../components/category-grid";
import type { Category } from "../types/category";

const categories: Category[] = [
  {
    id: "players",
    name: "Jogadores",
    imageUrl: "https://placehold.co/400x400?text=Jogadores",
    enabled: false,
  },
  {
    id: "npcs",
    name: "NPC's",
    imageUrl: "https://placehold.co/400x400?text=NPCs",
    enabled: false,
  },
  {
    id: "bestiary",
    name: "Bestiario",
    imageUrl: "https://placehold.co/400x400?text=Bestiario",
    enabled: false,
  },
  {
    id: "villains",
    name: "Vilões",
    imageUrl: "https://placehold.co/400x400?text=Viloes",
    enabled: false,
  },
  {
    id: "items",
    name: "Itens",
    imageUrl: "https://placehold.co/400x400?text=Itens",
    enabled: false,
  },
  {
    id: "spells",
    name: "Magias",
    imageUrl: "https://placehold.co/400x400?text=Magias",
    enabled: false,
  },
  {
    id: "classes",
    name: "Classes",
    imageUrl: "https://placehold.co/400x400?text=Classes",
    enabled: false,
  },
  {
    id: "places",
    name: "Locais",
    imageUrl: "https://placehold.co/400x400?text=Locais",
    enabled: false,
  },
  {
    id: "sessions",
    name: "Sessões",
    imageUrl: "https://placehold.co/400x400?text=Sessoes",
    path: "/sessions",
    enabled: true,
  },
];

export function HomePage() {
  return (
    <div>
      <PageTitle
        title="Hub da Campanha"
        subtitle="Explore as principais categorias públicas da campanha."
      />

      <CategoryGrid categories={categories} />
    </div>
  );
}