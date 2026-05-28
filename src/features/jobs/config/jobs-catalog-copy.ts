export const JOBS_CATALOG_COPY = {
  sidebar: {
    headerTitle: "Classes",
    headerSubtitle: "Classes da campanha",
    loadingMessage: "Carregando classes...",
    listAriaLabel: "Lista de classes",
    showAllButtonLabel: "Mostrar todas",
    emptyMessage: "Nenhuma classe encontrada.",
  },

  search: {
    placeholder: "Buscar classe por nome...",
  },

  filters: {
    clearButtonLabel: "Limpar filtros",
  },

  main: {
    loadingMessage: "Carregando classes...",
  },

  detail: {
    entityBadge: "Classe",
    loadingMessage: "Carregando detalhes...",
    errorMessage: "Não foi possível carregar os detalhes da classe.",

    sections: {
      background: "Background",
      powers: "Poderes",
      spells: "Magias",
      arcanas: "Arcanas",
    },

    background: {
      aliasesTitle: "Também conhecido como",
      questionsTitle: "Perguntas",
      questionLabel: "Pergunta",
    },

    powers: {
      maxLevelLabel: "Nível máximo",
      globalLabel: "Global",
    },

    spells: {
      costLabel: "Custo",
      targetLabel: "Alvo",
      durationLabel: "Duração",
      offensiveLabel: "Ofensiva",
      nonOffensiveLabel: "Não ofensiva",
    },

    arcanas: {
      mergeEffectLabel: "Efeito de Fusão",
      dismissEffectLabel: "Efeito de Dispensa",
      specialRuleLabel: "Regra Especial",
    },
  },

  emptyState: {
    title: "Nenhuma classe encontrada",
    descriptionWithoutFilters: "Nenhuma classe está disponível no momento.",
    descriptionWithFilters: "Tente limpar a busca ou remover filtros.",
  },
} as const;
